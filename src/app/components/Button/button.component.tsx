import React from 'react';
import './button.component.scss';

interface IButtonProps {
  color: 'success' | 'info' | 'important' | 'light' | 'dark';
  size: 'large' | 'normal' | 'round';
  className?: string;
  icon?: JSX.Element; // Put the size to normal to use icon
  href?: string; // we consider that the string is slugify (see utils)
  isSubmit?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface IButtonState {

}

class Button extends React.Component<IButtonProps, IButtonState> {
  render() { 
    const { color, size, isSubmit, disabled, href, onClick, className, icon } = this.props;

    return (
        <div className="button_component">
            <a href={href}>
              <button
                className={`button button-${color} button-${size} ${className ? className : ''}`}
                type={isSubmit ? 'submit' : 'button'}
                disabled={disabled}
                onClick={onClick}
              >
                <span className="button-content-container">
                  {icon && <span className="button-icon">{icon}</span>}
                  {this.props.children}
                </span>
              </button>
            </a>
        </div>
    )
  }
}

export default Button;
