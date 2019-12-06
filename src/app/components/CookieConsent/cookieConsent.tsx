import React from 'react';
import CookieConsent from 'react-cookie-consent';

const CookieConsentComponent: React.FunctionComponent<any> = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="J'accepte"
      enableDeclineButton
      declineButtonText="Je refuse"
      cookieName="HandleCookieHelloPlanet"
      style={{background: "#1A2358"}}
      buttonStyle={{
        background: "#52BD76",
        color: "#fff",
        fontSize: "13px",
        borderRadius: "25% / 100%",
        position: 'relative',
        top: '-5px',
        border: '2px solid #52BD76',
        boxShadow: '0px 2px 0px #46A164',
      }}
      declineButtonStyle={{
        background: "#DE7455",
        color: "#fff",
        fontSize: "13px",
        borderRadius: "25% / 100%",
        position: 'relative',
        top: '-5px',
        border: '2px solid #DE7455',
        boxShadow: '0px 2px 0px #B86046',
      }}
      expires={150}
    >
      <div style={{display: 'flex', alignItems: 'center', position: 'relative', top: '5px'}}>
        <img src="/assets/images/cookie.svg" alt="cookie image" style={{height: '30px'}}/>
        <p style={{height: 'fit-content', paddingLeft: '25px'}}>Ce site utilise des cookies pour améliorer l'expérience
          de l'utilisateur.</p>
      </div>
    </CookieConsent>
  )
};

export default CookieConsentComponent;
