'use client'

import { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email:'',
    gender: '',
    age: '',
    location: '',
    experiences: [
      { type: '', years: '' },
      { type: '', years: '' },
      { type: '', years: '' },
    ],
    talkMode: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://serverapi:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Registration successful!');
        // リダイレクトなど適切な処理を追加
      } else {
        console.error('Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
  <div>
      {/* 名前 */}
      <label>
        名前:
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </label>

      {/* ニックネーム */}
      <label>
        ニックネーム:
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => handleChange('nickname', e.target.value)}
        />
      </label>

      
      <label>
        email:
        <input
          type="text"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </label>

      {/* 性別 */}
      <label>
        性別:
        <select
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
        >
          <option value="">選択しない</option>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </label>

      {/* 年代 */}
      <label>
        年代:
        <select
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
        >
          <option value="">選択しない</option>
          <option value="10">10代</option>
          <option value="20">20代</option>
          <option value="30">30代</option>
          <option value="40">40代</option>
          <option value="50以上">50代以上</option>
        </select>
      </label>

      {/* 居住地 */}
      <label>
        居住地:
        <select
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
        >
          <option value="">選択しない</option>
          <option value="東京">東京</option>
          <option value="名古屋">名古屋</option>
          <option value="大阪">大阪</option>
          <option value="福岡">福岡</option>
        </select>
      </label>

      
      {/* トークモード */}
      <label>
        トークモード:
        <select
          value={formData.talkMode}
          onChange={(e) => handleChange('talkMode', e.target.value)}
        >
          <option value="やさしく">やさしく</option>
          <option value="厳しめ">厳しめ</option>
        </select>
      </label>

      {/* 送信ボタン */}
      <button onClick={handleSubmit}>登録する</button>
    </div>
  );
};

export default RegisterPage;
