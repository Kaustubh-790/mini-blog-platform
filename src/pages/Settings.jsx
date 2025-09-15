import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import LoadingSpinner from "../components/LoadingSpinner";
import { ImageWithFallback } from "../components/FallBackImage";
import api from "../services/api";
import {
  User,
  Palette,
  Save,
  Upload,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";

const Settings = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    autoSave: true,
    draftsRetention: 30,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUserSettings();
  }, [user, navigate]);

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        avatarUrl: userProfile.avatarUrl || "",
        twitter: userProfile.twitter || "",
        linkedin: userProfile.linkedin || "",
        instagram: userProfile.instagram || "",
      });
    }
  }, [userProfile]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await api.getUserSettings(token);

      if (response.success) {
        const settings = response.data;
        setPreferences(settings.preferences || preferences);
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handlePreferencesChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      profileData.twitter &&
      profileData.twitter.trim() !== "" &&
      !isValidUrl(profileData.twitter)
    ) {
      newErrors.twitter = "Please enter a valid URL";
    }

    if (
      profileData.linkedin &&
      profileData.linkedin.trim() !== "" &&
      !isValidUrl(profileData.linkedin)
    ) {
      newErrors.linkedin = "Please enter a valid URL";
    }

    if (
      profileData.instagram &&
      profileData.instagram.trim() !== "" &&
      !isValidUrl(profileData.instagram)
    ) {
      newErrors.instagram = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Please select an image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image size should be less than 5MB",
      }));
      return;
    }

    try {
      setSaveLoading(true);
      const token = await user.getIdToken();
      const response = await api.uploadImage(file, token);

      if (response.success) {
        setProfileData((prev) => ({
          ...prev,
          avatarUrl: response.data.url,
        }));
        setErrors((prev) => ({
          ...prev,
          avatar: "",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        avatar: error.message,
      }));
    } finally {
      setSaveLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!validateProfile()) return;

    try {
      setSaveLoading(true);
      const token = await user.getIdToken();

      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        avatarUrl: profileData.avatarUrl,
      };

      if (profileData.twitter && profileData.twitter.trim() !== "") {
        updateData.twitter = profileData.twitter;
      }
      if (profileData.linkedin && profileData.linkedin.trim() !== "") {
        updateData.linkedin = profileData.linkedin;
      }
      if (profileData.instagram && profileData.instagram.trim() !== "") {
        updateData.instagram = profileData.instagram;
      }

      await api.updateUserProfile(updateData, token);
      await refreshUserProfile();
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    } finally {
      setSaveLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaveLoading(true);
      const token = await user.getIdToken();

      const settingsData = {
        preferences: preferences,
      };

      await api.updateUserSettings(settingsData, token);
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setSaveLoading(true);
        const token = await user.getIdToken();
        await api.deleteAccount(token);
        navigate("/");
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message,
        }));
      } finally {
        setSaveLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "delete", label: "Delete Account", icon: Trash2 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Profile Information
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={profileData.avatarUrl || user?.photoURL}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        Change Photo
                      </label>
                      {errors.avatar && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.avatar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      className={errors.name ? "border-red-300" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <Input
                      type="url"
                      value={profileData.twitter}
                      onChange={(e) =>
                        handleProfileChange("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/username"
                      className={errors.twitter ? "border-red-300" : ""}
                    />
                    {errors.twitter && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.twitter}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <Input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) =>
                        handleProfileChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                      className={errors.linkedin ? "border-red-300" : ""}
                    />
                    {errors.linkedin && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.linkedin}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <Input
                      type="url"
                      value={profileData.instagram}
                      onChange={(e) =>
                        handleProfileChange("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/in/username"
                      className={errors.instagram ? "border-red-300" : ""}
                    />
                    {errors.instagram && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.instagram}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      {profileData.bio.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={saveProfile}
                    disabled={saveLoading}
                    className="flex items-center gap-2"
                  >
                    {saveLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) =>
                        handlePreferencesChange("theme", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Draft Retention (days)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={preferences.draftsRetention}
                      onChange={(e) =>
                        handlePreferencesChange(
                          "draftsRetention",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-save Drafts</div>
                        <div className="text-gray-600 text-sm">
                          Automatically save your work while writing
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) =>
                          handlePreferencesChange("autoSave", e.target.checked)
                        }
                        className="rounded"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={saveSettings}
                    disabled={saveLoading}
                    className="flex items-center gap-2"
                  >
                    {saveLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Settings
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "delete" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Delete Account</h2>

                <div className="space-y-6">
                  <p className="text-red-600 mb-4">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    disabled={saveLoading}
                    className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-100"
                  >
                    {saveLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
