import React from 'react';
import { UserProfile } from '../../types/market';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-surface-container-low border border-primary/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Yellow Header Accent */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-6">
          <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-12 h-12 rounded-full ring-2 ring-primary object-cover"
              />
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  {user.name}
                </h3>
                <p className="text-xs text-primary font-semibold">
                  {user.role}
                </p>
                <p className="text-xs text-outline font-normal">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="py-4 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-outline font-normal">Terminal Tier</span>
              <span className="px-2 py-0.5 rounded bg-primary text-black font-bold text-[11px]">
                {user.plan}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-outline font-normal">Specialty Focus</span>
              <span className="text-on-surface font-semibold text-right">
                {user.specialty}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-outline font-normal">Active Since</span>
              <span className="text-on-surface font-medium">
                {user.joinedDate}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <span className="text-outline block mb-1 font-normal">Analysis Mode:</span>
              <span className="text-secondary font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
                Pure Technical &amp; Fundamental Research (Zero Order Routing)
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-semibold hover:border-primary transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-tertiary-container/20 border border-tertiary/40 text-tertiary hover:bg-tertiary-container/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
