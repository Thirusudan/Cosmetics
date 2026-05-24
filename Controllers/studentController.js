import Student from "../models/student.js"

export function getStudents(req,res){
        Student.find()
		.then((students)=> {
            console.log(req.body)
			res.json(students)
		
        }).catch(()=> {
			res.json({
				message: "Failed to fetch students",
			})
		})

    }


    export function createStudents(req,res){
        if(req.user == null){
            res.status(403).json({
                message : "Please login to create a student"
            })
            return
        }

        if(req.user.role !="admin"){
            res.status(403).json({
                message : "please login as an admin to create a student"
            })
        }


        

        const student = new Student(
            {
                name : req.body.name,
                age : req.body.age,
                email : req.body.email
            }
        )

        student.save().then(()=>{
            res.json(
                {
                    message : "student saved successfully"
                }
            )
        }).catch(()=>{
            console.log("Failed to save student")
        })
       
}