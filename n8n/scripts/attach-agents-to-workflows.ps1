param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [string]$OutputPath = "",

  [switch]$Templates
)

function New-Slug {
  param([string]$Value)
  $slug = ($Value.ToLowerInvariant() -replace '[^a-z0-9]+', '-' -replace '^-+|-+$', '')
  if ($slug.Length -gt 48) {
    return $slug.Substring(0, 48)
  }
  return $slug
}

function Get-AgentMapping {
  param([object]$Workflow, [string]$FileName)

  $haystack = "$FileName $($Workflow.name)".ToLowerInvariant()
  $agents = New-Object System.Collections.Generic.List[string]
  $outputs = New-Object System.Collections.Generic.List[string]

  function Add-Unique {
    param([System.Collections.Generic.List[string]]$List, [string]$Value)
    if (-not $List.Contains($Value)) {
      [void]$List.Add($Value)
    }
  }

  Add-Unique $agents "operations_director_agent"
  Add-Unique $agents "compliance_qa_agent"

  if ($haystack -match 'youtube|tiktok|instagram|publisher|publication|blog_auto') {
    Add-Unique $agents "publishing_scheduler_agent"
    Add-Unique $agents "platform_setup_agent"
    Add-Unique $agents "social_post_agent"
    Add-Unique $outputs "posts"
  }
  if ($haystack -match 'video|youtube|ani|traveler|timezone|vessel') {
    Add-Unique $agents "video_concept_agent"
    Add-Unique $agents "scriptwriting_agent"
    Add-Unique $agents "video_production_agent"
    Add-Unique $outputs "videos"
  }
  if ($haystack -match 'traveler|timezone|travel|blog') {
    Add-Unique $agents "itinerary_agent"
    Add-Unique $outputs "itineraries"
  }
  if ($haystack -match 'ecommerce|merch|urban wear|vessel|revenue') {
    Add-Unique $agents "merch_design_agent"
    Add-Unique $agents "sticker_design_agent"
    Add-Unique $outputs "merch"
    Add-Unique $outputs "stickers"
  }
  if ($haystack -match 'asset|gallery|design|brand') {
    Add-Unique $agents "brand_design_agent"
    Add-Unique $agents "asset_management_agent"
    Add-Unique $outputs "designs"
  }
  if ($haystack -match 'analytics|dashboard|sentinel') {
    Add-Unique $agents "analytics_agent"
  }
  if ($haystack -match 'revenue|financial|tax|ecommerce') {
    Add-Unique $agents "revenue_agent"
  }
  if ($haystack -match 'synergy|community') {
    Add-Unique $agents "community_agent"
  }
  if ($haystack -match 'error|retry') {
    Add-Unique $agents "error_handler_agent"
  }
  if ($haystack -match 'secret|credential|oauth|setup') {
    Add-Unique $agents "platform_setup_agent"
  }
  if ($outputs.Count -eq 0) {
    Add-Unique $outputs "operations"
  }

  return [pscustomobject]@{
    attachedAt = "2026-06-03"
    mode = "manual_review_first"
    primaryAgents = @($agents)
    outputTypes = @($outputs)
    requiresManualApproval = $true
    publishAllowedByDefault = $false
    publishEnableEnv = "DAX_ENABLE_PUBLIC_PUBLISHING"
    approvalField = "reviewStatus=approved_for_publish"
    notes = "Attached to existing workflow. Public publishing is blocked unless explicit environment and item approval gates pass."
  }
}

function Test-PublicActionNode {
  param([object]$Node)

  $name = [string]$Node.name
  $type = [string]$Node.type
  $params = ""
  if ($Node.PSObject.Properties.Name -contains "parameters") {
    $params = $Node.parameters | ConvertTo-Json -Depth 30 -Compress
  }

  if ($name -match '^DAX Publish Guard') {
    return $false
  }
  if ($type -match 'youtube|youTube') {
    return $true
  }
  if ($name -match '^(Upload|Publish|Cross-Post|Post to|Post |Share to)') {
    return $true
  }
  if ($params -match 'youtube/v3/videos|media_publish|graph\.facebook|open-api\.tiktok|/share/video|wp-json|wordpress') {
    return $true
  }

  return $false
}

function Ensure-Array {
  param($Value)
  if ($null -eq $Value) { return @() }
  if ($Value -is [System.Array]) { return $Value }
  return @($Value)
}

function Add-Or-SetProperty {
  param([object]$Object, [string]$Name, $Value)
  if ($Object.PSObject.Properties.Name -contains $Name) {
    $Object.$Name = $Value
  } else {
    Add-Member -InputObject $Object -MemberType NoteProperty -Name $Name -Value $Value
  }
}

function Add-AgentAttachmentToWorkflow {
  param([object]$Workflow, [string]$FileName)

  if (-not ($Workflow.PSObject.Properties.Name -contains "nodes")) {
    return $Workflow
  }

  $mapping = Get-AgentMapping -Workflow $Workflow -FileName $FileName
  Add-Or-SetProperty -Object $Workflow -Name "daxAgentAttachment" -Value $mapping

  $nodes = [System.Collections.ArrayList]@(Ensure-Array $Workflow.nodes)
  $hasNote = $false
  foreach ($node in $nodes) {
    if ($node.name -eq "DAX Agent Attachment") {
      $hasNote = $true
      break
    }
  }

  if (-not $hasNote) {
    $note = [pscustomobject]@{
      parameters = [pscustomobject]@{
        content = "DAX Agent Attachment`nMode: manual_review_first`nAgents: $($mapping.primaryAgents -join ', ')`nOutputs: $($mapping.outputTypes -join ', ')`nPublishing requires DAX_ENABLE_PUBLIC_PUBLISHING=true and reviewStatus=approved_for_publish."
        height = 260
        width = 420
        color = 5
      }
      id = "dax-agent-attachment-note"
      name = "DAX Agent Attachment"
      type = "n8n-nodes-base.stickyNote"
      typeVersion = 1
      position = @(-160, -80)
    }
    [void]$nodes.Add($note)
  }

  if (-not ($Workflow.PSObject.Properties.Name -contains "connections") -or $null -eq $Workflow.connections) {
    Add-Or-SetProperty -Object $Workflow -Name "connections" -Value ([pscustomobject]@{})
  }

  $targetNodes = @($nodes | Where-Object { Test-PublicActionNode $_ })
  foreach ($target in $targetNodes) {
    $targetName = [string]$target.name
    $guardName = "DAX Publish Guard - $targetName"
    $guardId = "dax-publish-guard-$(New-Slug $targetName)"
    $guardExists = $false
    foreach ($node in $nodes) {
      if ($node.name -eq $guardName) {
        $guardExists = $true
        break
      }
    }

    if (-not $guardExists) {
      $x = 0
      $y = 0
      if ($target.PSObject.Properties.Name -contains "position" -and $target.position.Count -ge 2) {
        $x = [int]$target.position[0] - 260
        $y = [int]$target.position[1]
      }

      $guard = [pscustomobject]@{
        parameters = [pscustomobject]@{
          jsCode = "const enabled = `$env.DAX_ENABLE_PUBLIC_PUBLISHING === 'true';`nconst approvedValues = ['approved_for_publish', 'approved', 'ready_to_publish'];`nreturn `$input.all().filter((item) => {`n  const data = item.json || {};`n  const approved = data.approvedForPublish === true || approvedValues.includes(data.reviewStatus) || approvedValues.includes(data.review_status) || approvedValues.includes(data.approvalStatus);`n  return enabled && approved;`n}).map((item) => {`n  item.json.daxPublishingGuard = { passed: true, checkedAt: new Date().toISOString(), targetNode: '$targetName' };`n  return item;`n});"
        }
        id = $guardId
        name = $guardName
        type = "n8n-nodes-base.code"
        typeVersion = 2
        position = @($x, $y)
      }
      [void]$nodes.Add($guard)
    }

    $rewired = $false
    foreach ($srcProp in @($Workflow.connections.PSObject.Properties)) {
      if ($srcProp.Name -eq $guardName) { continue }
      $connObj = $srcProp.Value
      if ($null -eq $connObj) { continue }
      foreach ($channelProp in @($connObj.PSObject.Properties)) {
        $groups = @()
        foreach ($groupValue in (Ensure-Array $channelProp.Value)) {
          $newGroup = @()
          foreach ($connection in (Ensure-Array $groupValue)) {
            if ($connection.node -eq $targetName) {
              $newGroup += [pscustomobject]@{
                node = $guardName
                type = $connection.type
                index = $connection.index
              }
              $rewired = $true
            } else {
              $newGroup += $connection
            }
          }
          $groups += ,@($newGroup)
        }
        $connObj.($channelProp.Name) = @($groups)
      }
    }

    $guardConnection = $null
    if ($Workflow.connections.PSObject.Properties.Name -contains $guardName) {
      $guardConnection = $Workflow.connections.$guardName
    } else {
      $guardConnection = [pscustomobject]@{}
      Add-Member -InputObject $Workflow.connections -MemberType NoteProperty -Name $guardName -Value $guardConnection
    }

    $hasGuardToTarget = $false
    if ($guardConnection.PSObject.Properties.Name -contains "main") {
      foreach ($groupValue in (Ensure-Array $guardConnection.main)) {
        foreach ($connection in (Ensure-Array $groupValue)) {
          if ($connection.node -eq $targetName) {
            $hasGuardToTarget = $true
          }
        }
      }
    }

    if (-not $hasGuardToTarget) {
      Add-Or-SetProperty -Object $guardConnection -Name "main" -Value @(
        @(
          [pscustomobject]@{
            node = $targetName
            type = "main"
            index = 0
          }
        )
      )
    }
  }

  Add-Or-SetProperty -Object $Workflow -Name "nodes" -Value @($nodes)
  return $Workflow
}

function Should-PatchWorkflow {
  param([object]$Workflow, [string]$FileName)
  $name = [string]$Workflow.name
  if ($name -match '^DAX-0[0-4] ') { return $false }
  if ($FileName -match '^workflow_0[0-4]_') { return $false }
  return $true
}

if ($Templates) {
  $files = Get-ChildItem -Path $InputPath -Filter "*.json" | Where-Object { $_.Length -gt 0 }
  foreach ($file in $files) {
    try {
      $workflow = Get-Content -LiteralPath $file.FullName -Raw | ConvertFrom-Json
      if (Should-PatchWorkflow -Workflow $workflow -FileName $file.Name) {
        $workflow = Add-AgentAttachmentToWorkflow -Workflow $workflow -FileName $file.Name
        $workflow | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $file.FullName -Encoding UTF8
        Write-Output "PATCHED $($file.Name)"
      } else {
        Write-Output "SKIPPED $($file.Name)"
      }
    } catch {
      Write-Output "FAILED $($file.Name): $($_.Exception.Message)"
    }
  }
} else {
  if (-not $OutputPath) {
    throw "OutputPath is required when patching a workflow export file."
  }

  $raw = Get-Content -LiteralPath $InputPath -Raw
  $data = $raw | ConvertFrom-Json
  $workflows = Ensure-Array $data
  $patched = @()
  foreach ($workflow in $workflows) {
    if (Should-PatchWorkflow -Workflow $workflow -FileName "") {
      $patched += Add-AgentAttachmentToWorkflow -Workflow $workflow -FileName ""
      Write-Output "PATCHED $($workflow.name)"
    } else {
      $patched += $workflow
      Write-Output "SKIPPED $($workflow.name)"
    }
  }
  $patched | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $OutputPath -Encoding UTF8
}
