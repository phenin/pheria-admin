import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom";
import 'css/notfound.scss'

export default function PageNotFound() {
  const { t } = useTranslation('common')

  return (
    <div>
      <div className="not-found">
        <nav className="shelf">
          <Link className="book home-page" to="/">{t('home-page')}</Link>
          <Link className="book about-us" to="/about-us">{t('about-us')}</Link>
          <Link className="book contact" to="/sign-in">{t('sign-in')}</Link>
          <Link className="book faq" to="/sign-in">{t('faq')}</Link>
          
          <span className="book not-found"></span>
        
          <span className="door left"></span>
          <span className="door right"></span>
        </nav>
        <h1>{t('404')}</h1>
        <p>{t('info')}</p>
      </div>
    </div>
  )
}