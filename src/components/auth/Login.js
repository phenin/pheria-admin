import React, { useState } from 'react'
import 'css/login.scss'
import { useTranslation } from 'react-i18next'
import { Input, Button } from "antd"
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import { login } from 'store/actions/userActions'

export default function Login() {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const history = useHistory()

  const [form, setForm] = useState({})

  const handleChangeInput = (key, event) => {
    setForm({
      ...form, 
      [key]: event.target.value
    })
  }

  const handleSubmit = async () => {
    const success = await dispatch(login(form))
    if(success) history.push('/home')
  }

  return (
    <div className="sign-in_wrap">
      <div className="sign-in">
        <h1>{t('sign-in')}</h1>
        <Input 
          className="sign-in_input"
          value={form.email || ''} 
          type="email" 
          placeholder="Email" 
          onChange={(v) => handleChangeInput('email', v)}
        />
        <Input 
          className="sign-in_input"
          value={form.password || ''}
          type="password" 
          placeholder="Password"
          onChange={(v) => handleChangeInput('password', v)}
        />
        <Button 
          onClick={() => handleSubmit()}
          className="pheria-btn sign-in_input" 
          type="primary" 
          shape="round" 
          size='large'
        >
          {t('sign-in') }
        </Button>
      </div>
    </div>
  )
}
