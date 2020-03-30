import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, KeyboardAvoidingView } from 'react-native';

import logo from '../../assets/logo.png';

import Background from '../../components/Background';

import { signUpRequest } from '../../store/modules/auth/actions';

import { Container, Form, FormInput, SubmitButton, SignLink, SignLinkText } from './styles';

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const loading = useSelector(state => state.auth.loading);

  function handleSubmit() {
    dispatch(signUpRequest(name, email, password));
  }

  return (
    <Background>
      <KeyboardAvoidingView style={{ flex: 1}} behavior={"padding"} >
      <Container>
        <Image source={logo} />

        <Form>
          <FormInput 
            icon="person-outline" 
            autoCorrect={false} 
            autoCapitalize="none" 
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <FormInput 
            icon="mail-outline" 
            keyboardType="email-adress" 
            autoCorrect={false} 
            autoCapitalize="none" 
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput 
            icon="lock-outline" 
            secureTextEntry
            placeholder="Digite sua senha"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton onPress={handleSubmit}>Acessar</SubmitButton>
        </Form>

        <SignLink loading={loading} onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>Ja tenho Conta</SignLinkText>
        </SignLink>
      </Container>
      </KeyboardAvoidingView>
    </Background>
  );
}