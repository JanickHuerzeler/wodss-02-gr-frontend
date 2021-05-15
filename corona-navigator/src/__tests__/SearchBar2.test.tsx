import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import SearchBar from '../components/SearchBar'

const setup = () => {
  const utils = render(<SearchBar
    onLocationChanged={()=>{}}
    placeholder={"Von"}
    ></SearchBar>)
  const input = (utils.getByTestId('searchbarinput') as HTMLInputElement);
  return {
    input,
    ...utils,
  }
}

test('It should keep a $ in front of the input', () => {
  const { input } = setup()
  fireEvent.change(input, { target: { value: 'Aarau, Schweiz' } })
  expect(input.value).toBe('Aarau, Schweiz')
})
