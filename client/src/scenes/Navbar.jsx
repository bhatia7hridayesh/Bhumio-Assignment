import { Typography, Button } from '@mui/material'
import React from 'react'
import FlexBetween from '../components/FlexBetween';
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <div style={{backgroundColor: "#ccffcc"}}>
      <FlexBetween width="100%" padding="1rem 0">
        <FlexBetween width="40%" padding="0 10%">
        <Button 
        fontWeight="bold" 
        fontSize="clamp(1rem,2rem,2.25rem)" 
        color="primary"
        href='/'
        >
        Student Data
            
        </Button>
        </FlexBetween>
        <FlexBetween width="40%" padding="0 10%">
        <Button 
        fontWeight="bold" 
        fontSize="clamp(1rem,2rem,2.25rem)" 
        color="primary"
        href='/report'
        >
            Reports
        </Button>
        </FlexBetween>
      </FlexBetween>
    </div>
  )
}

export default Navbar
