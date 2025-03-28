
import React from "react";
import { useTelegramContext } from "@/context/TelegramContext";
import { Check } from "lucide-react";

const profileImages = [
  {
    id: "stewie",
    path: "/lovable-uploads/443dd78b-30ed-4d44-8dc2-ffba7b65d12f.png",
    alt: "Stewie cartoon character"
  },
  {
    id: "narwhal",
    path: "/lovable-uploads/deef485a-0e9b-459c-b81a-db634f3e0212.png",
    alt: "Blue narwhal character"
  },
  {
    id: "catgirl",
    path: "/lovable-uploads/94773cfe-36a4-49de-8f61-a93ce7196d24.png",
    alt: "Anime cat girl character"
  },
  {
    id: "ghost",
    path: "/lovable-uploads/290e47d6-ae9d-4fea-9cdb-2d14a148421c.png",
    alt: "Blue ghost character"
  },
  {
    id: "duck",
    path: "/lovable-uploads/b8918383-1371-49d4-a967-ba7d446bc065.png",
    alt: "Yellow duck character"
  }
];

const ProfileIconSelector: React.FC = () => {
  const { user, setProfileImage } = useTelegramContext();
  
  const handleSelectImage = (imagePath: string) => {
    setProfileImage(imagePath);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Choose Your Avatar</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {profileImages.map((image) => (
          <div 
            key={image.id}
            onClick={() => handleSelectImage(image.path)}
            className={`
              relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
              ${user?.profileImage === image.path ? 'ring-2 ring-app-purple scale-105' : 'hover:scale-105'}
            `}
          >
            <img 
              src={image.path} 
              alt={image.alt} 
              className="w-full aspect-square object-cover"
            />
            {user?.profileImage === image.path && (
              <div className="absolute inset-0 bg-app-purple/20 flex items-center justify-center">
                <Check className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileIconSelector;
