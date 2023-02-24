import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, TextField, Alert} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import Checkbox from '@mui/material/Checkbox';
import FlexBetween from '../components/FlexBetween';
import SendIcon from '@mui/icons-material/Send';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

function ReportPage() {
    const [reportData, setReportData] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [reportName, setReportName] = useState("");
    const [emailId, setEmailId] = useState("");
    const getReportData = async() => {
        const response = await fetch('http://127.0.0.1:5000/get-files');
        const data = await response.json();
        console.log(data);
        setReportData(data);
    }

    useEffect(() => {
        getReportData();
    }, []);

    const checkSelected = (name) => {
        if (selectedReports.includes(name)){
            const new_selectedReports = selectedReports.filter(function(file){
                return file !== name})
            setSelectedReports(new_selectedReports);
            console.log(selectedReports);
            console.log(selectedReports.length);
        }else{
            selectedReports.push(name)
            console.log(selectedReports);
            console.log(selectedReports.length);
        }
    }
    const sendMail = (selectedReports) => {
        if (selectedReports.length === 0){
            alert("Please select at least 1 report to send");
        }else{
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if ( re.test(emailId) ) {
                const response = fetch(`http://127.0.0.1:5000/send-mail/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "files": selectedReports,
                        "emailId": emailId
                    })
                })
                alert(`mail sent to ${emailId}`);
            }
            else {
                alert("enter valid email");
            }
            
        }

    }
    const getReportName = (event) => {
        setReportName(event.target.value);
    };
    const getEmailId = (event) => {
        setEmailId(event.target.value);
    }
    const mergeReports = async (selectedReports) => {
        if (selectedReports.length < 2){
            alert("Please select at least 2 report to send");
            
        }else{
            console.log(reportName);
            let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(spChars.test(reportName)){
                alert("Report name should not contain any special characters.")
            } else {
                const response = await fetch(`http://127.0.0.1:5000/merge-files/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "files": selectedReports,
                        file_name: reportName
                    })
                }
                );
                const data = await response.json();
                setReportData(data.files);
                alert("Merge Success");
            }
        }
    }
    
  return (
    
    <Box width="80%" padding="4% 10%">
        <TableContainer component={Paper} sx={{ maxWidth: "100%", backgroundColor: "#008080"}}>
            <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="center" colSpan={6}>
                        Reports
                    </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: "#008080"}}>
                        <TableCell align="center">Merge/Send</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Created At</TableCell>
                        <TableCell align="center"> View </TableCell>
                        <TableCell align="center">Download</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {reportData.length === 0 ? <TableCell align="center" colSpan={6}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#e6ffff"  }}
                >
                    No Reports
                </TableCell> :reportData.map((row) => (
                    <TableRow
                    key={row._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#e6ffff"  }}
                    >
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            onChange={() => checkSelected(row.filePath)}
                        />
                    </TableCell>
                    <TableCell align="center">{row.filePath}</TableCell>
                    <TableCell align="center">{row.createdAt.slice(0, 10)}</TableCell>
                    
                    <TableCell align="center">
                        
                        <Button
                            href={`http://127.0.0.1:5000/view-file?filePath=${row.filePath}`}
                            >
                            <VisibilityTwoToneIcon/>
                        </Button>
                    </TableCell>
                    <TableCell align="center">
                        <Button
                            href={`http://127.0.0.1:5000/download-file?filePath=${row.filePath.replace(" " , "%20")}`}
                            >
                            <FileDownloadTwoToneIcon/>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
            <FlexBetween padding="4% 0" >
            <Box minWidth="40%">
                <TextField 
                id="outlined-basic" 
                label="Enter Report Name" 
                variant="outlined" 
                sx={{ display: 'block', pb:"2%"}}
                onChange={getReportName}/>
                <Typography sx={{  pb:"2%"}}>
                    Note: The Reports are Merged In Order of Their Selection.
                </Typography>
                <Button color="error" variant="contained" onClick={() => mergeReports(selectedReports)}>
                Merge Reports &nbsp; <PictureAsPdfOutlinedIcon fontSize='small'/>
                </Button>
                
            </Box>
            <Box minWidth="40%">
            <TextField 
                id="outlined-basic" 
                label="Email Address" 
                variant="outlined" 
                size='medium'
                sx={{ display: 'block', pb:"2%"}}
                onChange={getEmailId}
                />
            <Button color="error" variant="contained" onClick={() => sendMail(selectedReports)} >
                Send Mail &nbsp; <SendIcon />
            </Button>
            </Box>
        </FlexBetween>
    </Box>
  )
}

export default ReportPage
