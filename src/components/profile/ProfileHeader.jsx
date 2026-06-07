import React from "react";
import { motion } from "framer-motion";

export default function ProfileHeader({ profile }) {
  const name = profile.displayName || profile.username || profile.name || 'User';
  const createdAt = profile.createdAt || profile.created_at;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-6 flex items-center gap-6"
    >
      <img
        src={profile.profilePicture || "/default-avatar.png"}
        alt="avatar"
        className="w-20 h-20 rounded-full object-cover border border-border"
      />

      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-muted-foreground text-sm">
          {createdAt ? `Member since ${new Date(createdAt).toLocaleDateString()}` : 'Member'}
        </p>

        {profile.isSeller && (
          <p className="text-xs mt-1 text-signal font-mono-code">
            Seller Account
          </p>
        )}
      </div>
    </motion.div>
  );
}
