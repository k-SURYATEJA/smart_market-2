import React from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'news';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-surface-container h-full shadow-2xl flex flex-col border-l border-outline-variant/30 animate-in slide-in-from-right duration-200">
        <div className="p-space-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
            <h3 className="font-headline-md font-bold text-on-surface">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-outline hover:text-on-surface font-mono-xs cursor-pointer"
                type="button"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-outline hover:text-on-surface cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-space-sm space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-outline font-mono-xs text-mono-xs">
              No new alerts or notifications.
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between font-mono-xs text-mono-xs">
                  <span className="font-bold text-on-surface">{item.title}</span>
                  <span className="text-outline text-[10px]">{item.time}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
