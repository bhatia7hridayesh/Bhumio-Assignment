import data from "./data/address.json"  assert {type: "json"};
import Files from "./models.js";
import {jsPDF} from "jspdf";
import fs from "fs";
import PDFMerger from "pdf-merger-js";
import nodemailer from "nodemailer";
import { report } from "process";
import autoTable from "jspdf-autotable";
export const result = (req, res) => {
    const num = req.query;
    //res.status(200).json(data.Students[1]);
    let res_data;
    if(num.search==="Zip"){
        res_data = data.Students.filter((student) => student.address.zip.includes(num.value));
        
    }
    else if(num.search==="Name"){
        res_data = data.Students.filter((student) => student.Name.includes(num.value));
    }
    else if(num.search === "City"){
        res_data = data.Students.filter((student) => student.address.city.includes(num.value));
    }
    else if(num.search==="Major"){
        res_data = data.Students.filter((student) => student.Major.includes(num.value));
    }
    else if(num.search==="State"){
        res_data = data.Students.filter((student) => student.address.state.includes(num.value));
    }
    else{
        res_data = data.Students;
    }
    res.status(200).json(res_data);
        
}
export const getAllFilePaths = async (req,res) => {
    try{
        const data = await Files.find();
        res.status(200).json(data);
    }catch(error){
        res.status(404).json({"error": error.message});
    }
        

}
export const verifyFileName = async(req, res) => {
    const data = req.query;
    try{
        const check = await Files.findOne({filePath: data.path});
        if (check){
            res.status(400).json({"msg": "Exists"});
            return;
        }
        res.status(200).json({"msg": "Available"});
    }catch(err){
        res.status(400).json({err});
    }
}

export const fileCreate = async (req, res) => {

    try{
        const {report_data, file_name} = req.body;
        const doc = new jsPDF();
        doc.text("Students Report", 10, 10)
        const tableData = report_data.map( (data) => 
        [data.Name, data.address.zip, data.address.address_1, data.address.address_2, data.address.city, data.address.state, data.Major])
        console.log(tableData);
        doc.autoTable({
            head: [['Name', 'Zip', 'Primary Address', 'Secondary Address','City', 'State', 'Major']],
            body: tableData,
          })
        doc.save(`public/files/${file_name}.pdf`);
        const new_path = new Files({
            filePath: file_name
            });
        await new_path.save();
        res.status(201).json(new_path);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

export const downloadFile = async (req, res) => {
    /*
    const filePath = `public/files/Testing Name.pdf`;

    const stream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Testing Name.pdf"`);

    stream.pipe(res);
}
    */
    const data = req.query;
    if (data){
        var file = fs.createReadStream(`public/files/${data.filePath}.pdf`);
        var stat = fs.statSync(`public/files/${data.filePath}.pdf`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${data.filePath}.pdf`);
        file.pipe(res);
    }else{
        res.status(400).json({"msg":"Please enter valid data as query"})
    }
}

export const viewFile = (req, res) => {
    
    const query = req.query;
    let path = `./public/files/${query.filePath}.pdf`;
    try{
        var data = fs.createReadStream(path);
        var stat = fs.statSync(`public/files/${query.filePath}.pdf`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${query.filePath}.pdf`);
        data.pipe(res);
    }catch(error){
        res.status(400).json({"error": error.message});

    }
    
}

export const mergeFile = async (req, res) => {
    const {files, file_name} = req.body;
    var merger = new PDFMerger();
    for (let i = 0; i < files.length; i++) {
        await merger.add(`./public/files/${files[i]}.pdf`);
    }
    await merger.save(`./public/files/${file_name}.pdf`);
    const report = Files({
        filePath: file_name
    });
    await report.save()
    const resp_data = await Files.find();
    res.status(200).json({"msg": "Success", "files": resp_data});
}

export const sendFileToMail = async (req, res) => {
    const {emailId, files} = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",  //add your gmail username (emailId before @gmail.com)
      pass: "", // Create an app password from your gmail account
    },
  });
  const attachments = files.map((file) => { return{
    filename: `${file}.pdf`,
    path: `./public/files/${file}.pdf`,
    contentType: 'application/pdf'
}})
    console.log(attachments[0]);
    console.log(typeof(attachments));
  let info = await transporter.sendMail({
    from: 'hridayeshbhatia2@gmail.com', // sender address
    to: emailId, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body

    attachments: attachments
        
  });

  res.status(200).json(info.messageId);
}