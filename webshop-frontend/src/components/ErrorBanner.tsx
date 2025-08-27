import React from 'react';

interface ErrorBannerProps {
    message: string;
    onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
    return (
        <div className="error-banner">
            <div className="error-banner-content">
                <span className="error-banner-message">{message}</span>
                <button className="error-banner-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default ErrorBanner;
