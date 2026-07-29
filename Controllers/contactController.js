import Contact from "../models/contact.js";

export async function createContact(req,res){
    const contact = new Contact(req.body); 
    try{
     const response = await contact.save()
     res.json({
        message : "Your Contact details sumbit Sucessfully We will contact you soon",
        contact : response
     })
    }catch(error){
        console.log(error)
        res.status(500).json({message : "Failed to submit contact details"})
    }
}

export async function getContact(req,res){
    try{
      const contacts = await Contact.find().sort({ createdAt: -1 })
      res.json(contacts)
    }catch(error){
    console.log(error)
    res(500).json({message : "Failed to get the Conatct details"})
    }
}
