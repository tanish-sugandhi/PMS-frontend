import React, { useState, useEffect } from 'react';
import SiderComponent from "../layout/SiderComponent";
import HeaderComponent from "../layout/HeaderComponent";
import FooterComponent from "../layout/FooterComponent";
import UserService from '../../services/UserService';

const token = JSON.parse(localStorage.getItem("token"))?.token;
const UserProfile = () => {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (userData) {
        try {
            console.log("User Object :::::", userData);
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
        }
    } else {
        console.log("No user data found in localStorage.");
    }

    const [isEditing, setIsEditing] = useState(false);
    const [aboutMe, setAboutMe] = useState(userData ? userData.aboutMe : '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);  // Add state for timeout ID

    const firstName = userData ? userData.firstName : '';
    const lastName = userData ? userData.lastName : '';
    const email = userData ? userData.email : '';

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await UserService.updateAboutMe(token, email, aboutMe);
            console.log('API response:', response);

            if (response && response.aboutMe !== undefined) {
                const updatedUserData = { ...userData, aboutMe: response.aboutMe };
                localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
                setError('');
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                const newTimeoutId = setTimeout(() => {
                    setSuccess('');
                }, 2000);
                setTimeoutId(newTimeoutId);
            } else {
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            setError('Error updating profile. Please try again.');
            setSuccess('');
            console.error('Error updating aboutMe:', error);
        }
    };

    const handleCancelClick = () => {
        setAboutMe(userData ? userData.aboutMe : '');
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div>
            <div className='row m-0 p-0 mainBgImg'>
                <div className='m-0 p-0 col-2'>
                    <SiderComponent />
                </div>
                <div className='me-0 p-0 col-10 border'>
                    <div>
                        <HeaderComponent />
                    </div>
                    <div className='p-5'>
                        <div className="profile-container">
                            <div className="profile-header">
                                <div className="profile-avatar bg-primary
                                ">
                                    <span className="avatar-initial">{firstName.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="profile-info">
                                    <h1>{firstName} {lastName}</h1>
                                    <span className="email"><i className="fa-regular fa-envelope me-2"></i>{email}</span>
                                </div>
                                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
                            </div>
                            <div className="profile-about">
                                <div style={{ border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px' }} className="p-3">
                                    <div className="d-flex justify-content-between align-item-center">
                                        <h2 className="ms-3 mb-3">About me</h2>
                                        {!isEditing && <i className="fa-solid fa-pen me-5" onClick={handleEditClick}></i>}
                                        {isEditing && (
                                            <div>
                                                <i className="fa-solid fa-check me-3" onClick={handleSaveClick}></i>
                                                <i className="fa-solid fa-times" onClick={handleCancelClick}></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <textarea
                                            name="postContent"
                                            placeholder="Use this space to tell people about yourself"
                                            rows={3}
                                            cols={135}
                                            className="p-3"
                                            style={{ borderRadius: '5px' }}
                                            value={aboutMe}
                                            onChange={(e) => setAboutMe(e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    {error && <p className="text-danger">{error}</p>}
                                    {success && <p className="text-success">{success}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
