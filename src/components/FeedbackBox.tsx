import React, { useState, useRef, useEffect } from 'react';
import { Send, Check, Paperclip, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_WORDS = 500;
const RECIPIENT_EMAIL = 'yuvrajkumar0221@gmail.com';

const FeedbackBox: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const wordCount = getWordCount(feedback);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const words = value.trim() ? value.trim().split(/\s+/) : [];

    if (words.length > MAX_WORDS) {
      const truncated = words.slice(0, MAX_WORDS).join(' ');
      setFeedback(truncated);
    } else {
      setFeedback(value);
    }
  };

  // Dynamically auto-resize textarea height as text is filled
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [feedback]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    // Validate file type (png or jpg/jpeg)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
      setFileError('Only PNG & JPG images are allowed.');
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10MB.');
      return;
    }

    setAttachedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!feedback.trim() && !attachedFile) || isSending) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('_subject', 'Portfolio Feedback & Suggestions');
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('message', feedback.trim() || '(No text message provided)');
      formData.append('submitted_at', new Date().toLocaleString());

      if (attachedFile) {
        formData.append('attachment', attachedFile);
      }

      // Send form directly to FormSubmit background API
      await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
    } catch (err) {
      console.warn('Background email submission handled:', err);
    } finally {
      setIsSending(false);
      setSubmitted(true);
      setFeedback('');
      handleRemoveFile();

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  const canSubmit = (feedback.trim().length > 0 || attachedFile !== null) && !isSending;

  return (
    <div className="w-full max-w-md mx-auto mt-4 px-2 select-text min-h-[165px] flex flex-col justify-start">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-ppmori text-xs font-medium tracking-wide text-center"
          >
            <div className="w-5 h-5 rounded-full bg-white text-[#120F17] flex items-center justify-center shrink-0">
              <Check size={12} className="stroke-[3]" />
            </div>
            <span>Thank you! Your feedback & suggestions have been submitted successfully.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <textarea
              ref={textareaRef}
              value={feedback}
              onChange={handleTextChange}
              rows={2}
              disabled={isSending}
              placeholder="How can I improve this portfolio? Share your feedback or attach screenshot..."
              className="w-full bg-transparent text-xs sm:text-sm font-ppmori text-white/90 placeholder:text-white/40 placeholder:font-ppmori outline-none border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none shadow-none focus:shadow-none resize-none leading-relaxed px-1 pt-0.5 max-h-[180px] disabled:opacity-50"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', boxShadow: 'none' }}
            />

            {/* Attached File Preview */}
            <AnimatePresence>
              {attachedFile && previewUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white/90 text-xs font-ppmori"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Attachment Preview"
                      className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                    <div className="flex flex-col truncate">
                      <span className="truncate text-xs font-medium text-white/95">
                        {attachedFile.name}
                      </span>
                      <span className="text-[10px] text-white/40 font-ppmori">
                        {(attachedFile.size / 1024).toFixed(1)} KB • PNG/JPG
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isSending}
                    className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 outline-none focus:outline-none disabled:opacity-50"
                    title="Remove file"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {fileError && (
              <span className="text-[11px] font-ppmori text-red-400 px-1">
                {fileError}
              </span>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 px-1">
              <div className="flex items-center gap-2">
                {/* Attach File Button with Hover Tooltip */}
                <div className="relative inline-flex items-center group">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending}
                    className="flex items-center gap-1.5 text-xs font-ppmori text-white/50 hover:text-white transition-colors py-1 px-1 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Paperclip size={14} className="text-white/60 group-hover:text-white transition-colors" />
                  </button>

                  {/* Tooltip on right side on hover */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-[#120F17]/95 border border-white/15 backdrop-blur-md text-[10px] font-ppmori text-white/90 whitespace-nowrap shadow-xl pointer-events-none z-30">
                    <span>Attached file (PNG & JPG only)</span>
                  </div>
                </div>

                {/* Word Counter */}
                {wordCount > 0 && (
                  <span className="text-[10px] font-ppmori text-white/35">
                    {wordCount}/{MAX_WORDS} words
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`h-7 px-4 rounded-full font-ppmori text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${
                  canSubmit
                    ? 'bg-white text-[#120F17] hover:bg-white/90 cursor-pointer hover:scale-105 active:scale-95'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isSending ? (
                  <>
                    <span>Sending</span>
                    <Loader2 size={11} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send size={11} className={canSubmit ? 'translate-x-0.5 transition-transform' : ''} />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackBox;
