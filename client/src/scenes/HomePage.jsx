import React, { useEffect, useState } from 'react'
import FlexBetween from '../components/FlexBetween'
import {Icon, Menu, MenuItem, TextField, IconButton, Box, Button, Alert, Typography} from '@mui/material';
import {Search} from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { Navigate, useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [reportName, setReportName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchResult, setIsSearchResult] = useState(false);
    const getData = async() => {
        const response = await fetch(`http://127.0.0.1:5000/`);
        const data = await response.json();
        console.log(data);
        setTableData(data);
    }
    useEffect(() => {
        getData();
    }, []);
    const getReportName = (event) => {
        setReportName(event.target.value);
    };
    const createReport = async () => {
        if (reportName===""){
            alert("Please enter a valid Report Name");
            return;
        }
        const response = await fetch(`http://127.0.0.1:5000/check-file-name?path=${reportName}`);
        const availability = await response.json();
        console.log(availability);
        if(availability.msg === "Available"){
            const report = await fetch('http://127.0.0.1:5000/create-pdf',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ "report_data": tableData, "file_name": reportName })
            }
            );
            if(report.status===201){
                navigate("/report");
                alert("Report created successfully");
            }else{
                alert('Something Went Wrong');
            }
        }
    };
    const searchData = (event) => {
        setSearchQuery(event.target.value);
        console.log(searchQuery);
    }
    const searchRequest = async() => {
        if(searchQuery === ""){
            return;
        }
        const value = document.getElementById("value").innerHTML;
        const response = await fetch(`http://127.0.0.1:5000?search=${value}&value=${searchQuery}`);
        const data = await response.json();
        
        setTableData(data);
        setIsSearchResult(true);
    }
    const options = ['Name', 'Zip', 'City', 'State', 'Major'];
  return (
      <Box width="80%" padding="4% 10%">
      <Box padding="2% 0">
      {isSearchResult ? <>
        <Typography>
            {tableData.length} Results.
        </Typography>
      </> : <></>}
      <TextField id="standard-basic" label="Search" variant="standard" onChange={searchData} />
        <TextField
          id="value"
          select
          label="Search By:"
          defaultValue="Name"
          variant="standard"
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <IconButton onClick={searchRequest}>
            <Search />
        </IconButton>
      </Box>

        
        <TableContainer component={Paper} sx={{ maxWidth: "100%", backgroundColor: "#008080"}}>
            <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="center" colSpan={7}>
                        <Typography
                        variant='h3'
                        >
                        Student Details
                        </Typography>
                        
                    </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#008080"}}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Major</TableCell>
                        <TableCell align="right">Primary Address</TableCell>
                        <TableCell align="right">Secondary Address</TableCell>
                        <TableCell align="right">City</TableCell>
                        <TableCell align="right">State</TableCell>
                        <TableCell align="right">Zip</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {tableData.map((row) => (
                    <TableRow
                    key={row.Name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#e6ffff" }}
                    >
                    <TableCell component="th" scope="row">
                        {row.Name}
                    </TableCell>
                    <TableCell align="right">{row.Major}</TableCell>
                    <TableCell align="right">{row.address.address_1}</TableCell>
                    <TableCell align="right">{row.address.address_2}</TableCell>
                    <TableCell align="right">{row.address.city}</TableCell>
                    <TableCell align="right">{row.address.state}</TableCell>
                    <TableCell align="right">{row.address.zip}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <Box padding="2% 0" maxwidth="80%">
                <TextField 
                id="outlined-basic" 
                label="Enter Report Name" 
                variant="outlined" 
                onChange={getReportName}/>
                <Button 
                variant="contained" 
                sx={{p: "1.5% 3%"}} 
                color="error"
                onClick={createReport}
                >Create Report &nbsp;
                <PictureAsPdfOutlinedIcon fontSize='small'/>
                </Button>
            </Box>
            
      </Box>

      
  )
};

export default HomePage;
