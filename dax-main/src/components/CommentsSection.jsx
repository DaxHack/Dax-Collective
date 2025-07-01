// src/components/CommentsSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import {
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  TrashIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Firebase imports
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const CommentsSection = ({ sectionId, sectionTitle = "Comments" }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize auth
  React.useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      // Auto sign-in anonymously if no user
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous auth failed:', error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load comments
  React.useEffect(() => {
    if (!sectionId) return;

    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('sectionId', '==', sectionId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    }, (error) => {
      console.error('Error loading comments:', error);
    });

    return () => unsubscribe();
  }, [sectionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment.trim(),
        sectionId,
        userId: user.uid,
        userDisplayName: user.displayName || 'Anonymous User',
        createdAt: serverTimestamp(),
        isAnonymous: user.isAnonymous
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const canDeleteComment = (comment) => {
    return user && (comment.userId === user.uid);
  };

  if (authLoading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
=======
import { 
  ChatBubbleLeftIcon, 
  PaperAirplaneIcon, 
  TrashIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import DeveloperOnly from './DeveloperOnly';

const CommentsSection = ({ animeId, animeTitle }) => {
  const { comments, loading, error, addComment, deleteComment } = useComments(animeId);
  const { user, isDeveloper } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await addComment(newComment);
    if (success) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-400">Loading comments...</span>
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
    >
      <div className="flex items-center mb-6">
        <ChatBubbleLeftIcon className="w-6 h-6 text-purple-400 mr-2" />
        <h3 className="text-xl font-bold text-white">{sectionTitle}</h3>
        <span className="ml-2 text-sm text-gray-400">({comments.length})</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="3"
              maxLength={500}
            />
            <div className="text-xs text-gray-400 mt-1">
              {newComment.length}/500 characters
            </div>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="self-start bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
=======
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <ChatBubbleLeftIcon className="h-6 w-6 text-purple-400 mr-3" />
        <h3 className="text-xl font-bold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">Error: {error}</p>
        </div>
      )}

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Share your thoughts about ${animeTitle}...`}
                className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                rows="3"
                maxLength="500"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {newComment.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
<<<<<<< HEAD
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <ChatBubbleLeftIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No comments yet. Be the first!</p>
            </motion.div>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-700/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-white">
                      {comment.userDisplayName}
                    </span>
                    {comment.isAnonymous && (
                      <ShieldCheckIcon className="w-4 h-4 text-blue-400" title="Anonymous User" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                    </span>
                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete comment"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {comment.text}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
=======
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  {comment.author.photoURL ? (
                    <img 
                      src={comment.author.photoURL} 
                      alt={comment.author.displayName} 
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400 mr-3" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {comment.author.displayName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                
                <DeveloperOnly>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Delete comment (Developer only)"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </DeveloperOnly>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{comment.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
  );
};

export default CommentsSection;
<<<<<<< HEAD
=======

>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
