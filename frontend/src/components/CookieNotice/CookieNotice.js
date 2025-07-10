import React from 'react';
import { notification, Button } from 'antd';
import { getCookie, setCookie, deleteCookie } from '../../utils';
import './CookieNotice.css';

class CookieNotice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    // Проверяем, принял ли пользователь уже cookies
    const cookiesAccepted = getCookie('cookiesAccepted');
    if (!cookiesAccepted) {
      this.setState({ isVisible: true });
    }
  }

  acceptCookies = () => {
    setCookie('cookiesAccepted', 'true', 365); // Сохраняем на год
    this.setState({ isVisible: false });
    
    // Показываем уведомление об успешном принятии
    notification.success({
      message: 'Cookies accepted',
      description: 'Thank you for accepting our cookie policy',
      placement: 'bottomRight',
      duration: 3,
    });
  };

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    return (
      <div className="cookie-notice">
        <div className="cookie-notice-content">
          <div className="cookie-notice-text">
            <h3>We use cookies</h3>
            <p>
              This website uses cookies to enhance your experience and to analyze our traffic. 
              By continuing to use this site, you agree to our use of cookies.
            </p>
          </div>
          <div className="cookie-notice-actions">
            <Button 
              type="primary" 
              onClick={this.acceptCookies}
              className="my-orange-button-solid"
            >
              Accept All Cookies
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CookieNotice;
