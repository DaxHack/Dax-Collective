#!/usr/bin/env python3
"""
Video Creation Scripts for Dax Collective Automation
Integrates with n8n workflows, FFmpeg, and Docker
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np

class VideoCreator:
    def __init__(self):
        self.output_dir = Path("/app/output/videos")
        self.assets_dir = Path("/app/assets")
        self.fonts_dir = Path("/app/fonts")
        self.templates_dir = Path("/app/templates")
        
        # Ensure directories exist
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.assets_dir.mkdir(parents=True, exist_ok=True)
        
        # Brand configurations
        self.brand_configs = {
            "gods_vessel": {
                "colors": {"primary": "#4A90E2", "secondary": "#F5F5F5", "accent": "#FFD700"},
                "font": "Montserrat-Bold.ttf",
                "background": "faith_background.jpg",
                "logo": "gods_vessel_logo.png"
            },
            "ani_dax": {
                "colors": {"primary": "#FF6B6B", "secondary": "#4ECDC4", "accent": "#45B7D1"},
                "font": "Roboto-Bold.ttf",
                "background": "anime_background.jpg",
                "logo": "ani_dax_logo.png"
            },
            "dax_traveler": {
                "colors": {"primary": "#2ECC71", "secondary": "#3498DB", "accent": "#F39C12"},
                "font": "OpenSans-Bold.ttf",
                "background": "travel_background.jpg",
                "logo": "dax_traveler_logo.png"
            },
            "timezone_travelers": {
                "colors": {"primary": "#9B59B6", "secondary": "#E74C3C", "accent": "#1ABC9C"},
                "font": "Lato-Bold.ttf",
                "background": "productivity_background.jpg",
                "logo": "timezone_travelers_logo.png"
            }
        }

    def create_short_video(self, script, audio_file, title, brand, viral_score, output_dir):
        """Create short-form video (portrait, <1min)"""
        try:
            brand_config = self.brand_configs.get(brand, self.brand_configs["gods_vessel"])
            
            # Create video frames
            frames = self.generate_text_frames(script, brand_config, format="portrait")
            
            # Create video from frames
            video_path = self.create_video_from_frames(
                frames, audio_file, title, "portrait", output_dir
            )
            
            # Add viral elements for high-scoring content
            if int(viral_score) > 85:
                video_path = self.add_viral_effects(video_path, brand_config)
            
            return video_path
            
        except Exception as e:
            print(f"Error creating short video: {e}")
            return None

    def create_longform_video(self, script, audio_file, title, brand, duration, output_dir):
        """Create long-form video (landscape, 6-30min)"""
        try:
            brand_config = self.brand_configs.get(brand, self.brand_configs["gods_vessel"])
            
            # Create extended content frames
            frames = self.generate_extended_frames(script, brand_config, duration)
            
            # Create video from frames
            video_path = self.create_video_from_frames(
                frames, audio_file, title, "landscape", output_dir
            )
            
            # Add chapters and engagement elements
            video_path = self.add_longform_elements(video_path, brand_config, duration)
            
            return video_path
            
        except Exception as e:
            print(f"Error creating longform video: {e}")
            return None

    def generate_text_frames(self, script, brand_config, format="portrait"):
        """Generate video frames with animated text"""
        frames = []
        
        # Split script into segments
        segments = self.split_script_into_segments(script)
        
        # Frame dimensions
        if format == "portrait":
            width, height = 1080, 1920
        else:
            width, height = 1920, 1080
        
        for i, segment in enumerate(segments):
            # Create frame
            frame = Image.new('RGB', (width, height), brand_config["colors"]["primary"])
            draw = ImageDraw.Draw(frame)
            
            # Load font
            try:
                font_path = self.fonts_dir / brand_config["font"]
                font = ImageFont.truetype(str(font_path), 60)
                title_font = ImageFont.truetype(str(font_path), 80)
            except:
                font = ImageFont.load_default()
                title_font = ImageFont.load_default()
            
            # Add background image if available
            bg_path = self.assets_dir / brand_config["background"]
            if bg_path.exists():
                background = Image.open(bg_path).resize((width, height))
                frame.paste(background, (0, 0))
                # Add overlay for text readability
                overlay = Image.new('RGBA', (width, height), (0, 0, 0, 128))
                frame = Image.alpha_composite(frame.convert('RGBA'), overlay).convert('RGB')
            
            # Add text with word wrapping
            self.draw_wrapped_text(draw, segment, font, width-100, height//2, 
                                 brand_config["colors"]["secondary"])
            
            # Add logo
            logo_path = self.assets_dir / brand_config["logo"]
            if logo_path.exists():
                logo = Image.open(logo_path).resize((150, 150))
                frame.paste(logo, (width-200, 50), logo.convert('RGBA'))
            
            frames.append(np.array(frame))
        
        return frames

    def generate_extended_frames(self, script, brand_config, duration):
        """Generate frames for long-form content with chapters"""
        frames = []
        
        # Create chapter structure
        chapters = self.create_chapters(script, int(duration))
        
        # Frame dimensions (landscape)
        width, height = 1920, 1080
        
        for chapter_idx, chapter in enumerate(chapters):
            # Chapter title frame
            title_frame = self.create_chapter_title_frame(
                f"Chapter {chapter_idx + 1}: {chapter['title']}", 
                brand_config, width, height
            )
            frames.extend([title_frame] * 90)  # 3 seconds at 30fps
            
            # Chapter content frames
            content_frames = self.generate_text_frames(
                chapter['content'], brand_config, "landscape"
            )
            frames.extend(content_frames)
        
        return frames

    def create_video_from_frames(self, frames, audio_file, title, format, output_dir):
        """Create video file from frames and audio"""
        try:
            # Setup video writer
            if format == "portrait":
                width, height = 1080, 1920
            else:
                width, height = 1920, 1080
            
            fps = 30
            output_path = Path(output_dir) / f"{title}_{format}.mp4"
            
            # Create video writer
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            video_writer = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
            
            # Write frames
            for frame in frames:
                # Convert RGB to BGR for OpenCV
                frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                video_writer.write(frame_bgr)
            
            video_writer.release()
            
            # Add audio using FFmpeg
            if audio_file:
                self.add_audio_to_video(str(output_path), audio_file)
            
            return str(output_path)
            
        except Exception as e:
            print(f"Error creating video from frames: {e}")
            return None

    def add_audio_to_video(self, video_path, audio_file):
        """Add audio to video using FFmpeg"""
        try:
            temp_path = video_path.replace('.mp4', '_temp.mp4')
            
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-i', audio_file,
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-shortest',
                temp_path
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            
            # Replace original with audio version
            os.replace(temp_path, video_path)
            
        except subprocess.CalledProcessError as e:
            print(f"Error adding audio: {e}")

    def add_viral_effects(self, video_path, brand_config):
        """Add viral effects for high-scoring content"""
        try:
            output_path = video_path.replace('.mp4', '_viral.mp4')
            
            # Add zoom effects, transitions, and engagement elements
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-vf', 'zoompan=z=\'min(zoom+0.0015,1.5)\':d=125:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2)',
                '-c:a', 'copy',
                output_path
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            
            # Replace original
            os.replace(output_path, video_path)
            
            return video_path
            
        except subprocess.CalledProcessError as e:
            print(f"Error adding viral effects: {e}")
            return video_path

    def add_longform_elements(self, video_path, brand_config, duration):
        """Add chapters, timestamps, and engagement elements for long-form"""
        try:
            # Add chapter markers and progress indicators
            output_path = video_path.replace('.mp4', '_enhanced.mp4')
            
            # Create progress bar overlay
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-vf', f'drawbox=x=0:y=ih-10:w=iw*t/{duration}:h=10:color={brand_config["colors"]["accent"]}:t=fill',
                '-c:a', 'copy',
                output_path
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            
            # Replace original
            os.replace(output_path, video_path)
            
            return video_path
            
        except subprocess.CalledProcessError as e:
            print(f"Error adding longform elements: {e}")
            return video_path

    def split_script_into_segments(self, script):
        """Split script into timed segments"""
        sentences = script.split('. ')
        segments = []
        
        for i in range(0, len(sentences), 2):
            segment = '. '.join(sentences[i:i+2])
            if segment:
                segments.append(segment)
        
        return segments

    def create_chapters(self, script, duration):
        """Create chapter structure for long-form content"""
        paragraphs = script.split('\n\n')
        chapters = []
        
        for i, paragraph in enumerate(paragraphs):
            if len(paragraph.strip()) > 50:  # Only substantial paragraphs
                title = paragraph.split('.')[0][:50] + "..."
                chapters.append({
                    'title': title,
                    'content': paragraph,
                    'timestamp': i * (duration // len(paragraphs))
                })
        
        return chapters

    def create_chapter_title_frame(self, title, brand_config, width, height):
        """Create chapter title frame"""
        frame = Image.new('RGB', (width, height), brand_config["colors"]["primary"])
        draw = ImageDraw.Draw(frame)
        
        try:
            font_path = self.fonts_dir / brand_config["font"]
            font = ImageFont.truetype(str(font_path), 100)
        except:
            font = ImageFont.load_default()
        
        # Center the title
        bbox = draw.textbbox((0, 0), title, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        draw.text((x, y), title, font=font, fill=brand_config["colors"]["secondary"])
        
        return np.array(frame)

    def draw_wrapped_text(self, draw, text, font, max_width, y_position, color):
        """Draw text with word wrapping"""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Draw lines
        line_height = 70
        start_y = y_position - (len(lines) * line_height // 2)
        
        for i, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=font)
            text_width = bbox[2] - bbox[0]
            x = (1080 - text_width) // 2  # Center horizontally
            draw.text((x, start_y + i * line_height), line, font=font, fill=color)


def main():
    parser = argparse.ArgumentParser(description='Create videos for Dax Collective')
    parser.add_argument('--script', required=True, help='Video script content')
    parser.add_argument('--audio-file', required=True, help='Path to audio file')
    parser.add_argument('--title', required=True, help='Video title')
    parser.add_argument('--format', required=True, choices=['short', 'long'], help='Video format')
    parser.add_argument('--brand', required=True, help='Brand name')
    parser.add_argument('--viral-score', type=int, default=50, help='Viral score (0-100)')
    parser.add_argument('--duration', type=int, default=60, help='Video duration in seconds')
    parser.add_argument('--output-dir', required=True, help='Output directory')
    
    args = parser.parse_args()
    
    creator = VideoCreator()
    
    if args.format == 'short':
        video_path = creator.create_short_video(
            args.script, args.audio_file, args.title, 
            args.brand, args.viral_score, args.output_dir
        )
    else:
        video_path = creator.create_longform_video(
            args.script, args.audio_file, args.title,
            args.brand, args.duration, args.output_dir
        )
    
    if video_path:
        print(f"Video created successfully: {video_path}")
        return 0
    else:
        print("Failed to create video")
        return 1


if __name__ == "__main__":
    sys.exit(main())