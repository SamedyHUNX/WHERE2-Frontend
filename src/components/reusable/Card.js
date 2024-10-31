// Card.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// Assets
import EnabledMap from '../../assets/svg/EnabledMap.svg';
import DisabledMap from '../../assets/svg/DisabledMap.svg';
import MiniMap from '../../assets/svg/miniMap.svg';
import BookMark from '../../assets/svg/bookmark.svg';
import Calender from '../../assets/svg/calender.svg';
import MiniClock from '../../assets/svg/miniClock.svg';
import FilledHeart from '../../assets/svg/filled-heart.svg';
import { Facebook, Instagram, Twitter, Youtube, Chrome, ImageIcon } from 'lucide-react';
import { convertToHTML } from '../../utility/markdownConverter/markdownConverter';
import Button from './ButtonComponent';

// Slice actions
import { addFavorite, removeFavorite, setIsClicked } from '../../features/slices/favoriteSlice';

// Styles
import './Card.css';

const Card = ({
  image,
  imageAlt = '',
  title = '',
  description = '',
  socialLinks: { facebookLink = '', instagramLink = '', twitterLink = '', youtubeLink = '', websiteLink = '' } = {},
  position,
  salary,
  term,
  loan_size,
  interest,
  location,
  deadLine = '',
  timeOut = '',
  route,
  type,
  isHeartClicked,
  id,
  size,
  price,
  mapURL,
  redirect
}) => {
  const user = JSON.parse(localStorage.getItem('authData'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [heartClicked, setHeartClicked] = useState();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setHeartClicked(isHeartClicked);
  }, [isHeartClicked]);

  const handleReadMoreClick = () => {
    navigate(route);
  };

  const handleHeartClick = async () => {
    setHeartClicked(false);
    await removeFavorite(id, type);
    dispatch(setIsClicked({ id }));
  };

  const handleRemoveHeartClick = async () => {
    if (user) {
      setHeartClicked(true);
      await addFavorite(id, type);
      dispatch(setIsClicked({ id }));
    } else if (window.confirm('Please login or Sign up to Add your Collection!')) {
      navigate('/login');
    }
  };

  const handleError = () => setImageError(true);

  const socialMediaIcons = [
    { icon: Facebook, linkKey: facebookLink },
    { icon: Twitter, linkKey: twitterLink },
    { icon: Instagram, linkKey: instagramLink },
    { icon: Youtube, linkKey: youtubeLink },
    { icon: Chrome, linkKey: websiteLink, isExternal: true },
  ];

  const workDetails = [
    { icon: MiniClock, linkKey: timeOut },
    { icon: Calender, linkKey: deadLine },
    { icon: MiniMap, linkKey: location },
  ];
  if (description.length >= 250) {
    description = `${description.substring(0,250)}...`
  }
  return (
    <div className="card-container">
      <div className="image-container">
        {imageError || !image ? (
          <div className="image">
            <ImageIcon size={48} color="gray" />
          </div>
        ) : (
          <img className="image" src={image} alt={imageAlt} onError={handleError} />
        )}
      </div>

      <div className="content">
        <div className='body'>
          <h5 className="title">{title.length > 50 ? `${title.substring(0, 47)}...` : title}</h5>

          <div className="work-details">
            {workDetails.map(({ icon, linkKey }, index) => (
              linkKey && (
                <div key={index} className="detail">
                  <img src={icon} alt="" />
                  <p>{linkKey}</p>
                </div>
              )
            ))}
          </div>

          {type === 'job' && (
            <div className="job-info">
              <p><b>Position</b>: <span>{position}</span></p>
              <p><b>Salary</b>: <span>${salary}</span></p>
            </div>
          )}

          {type === 'loan' && (
            <div className="loan-info">
              <p>Term: <span>{term}</span></p>
              <p>Interest Rate: <span>{interest}</span></p>
            </div>
          )}

          {type === 'accommodation' && (
            <div className="accommodation-info">
              <p>Size: <span>{size}</span></p>
              <p>Price: <span>{price}</span></p>
            </div>
          )}

          <div className="description">
            {convertToHTML(description)}
          </div>
        </div>
        <div className='footer'>
          <div className="actions">
            <div className="social-icons">
              {socialMediaIcons.map(({ icon: Icon, linkKey, isExternal }, index) =>
                linkKey ? (
                  isExternal ? (
                    <a href={linkKey} key={index} target="_blank" rel="noopener noreferrer">
                      <Icon />
                    </a>
                  ) : (
                    <Link to={linkKey} key={index}>
                      <Icon />
                    </Link>
                  )
                ) : null
              )}
            </div>

            <div className="buttons">
              <img
                className="heart-icon"
                src={heartClicked ? FilledHeart : BookMark}
                alt="Heart"
                onClick={heartClicked ? handleHeartClick : handleRemoveHeartClick}
              />
              <Link to={`/location/${location}`}>
                <img className="map-icon" src={mapURL ? EnabledMap : DisabledMap} alt="Map" />
              </Link>
              <Button className="p-2" onClick={handleReadMoreClick}>Read More</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
