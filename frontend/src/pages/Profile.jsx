
import React from 'react';
import UserProfile from '../components/users/UserProfile';

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <UserProfile />
    </div>
  );
};

export default Profile;
