const userSchema = require('./schema/user.model')

async function AddUsers(data){
    try{
        const dt= await userSchema.create({
            password:data.password,
            email:data.email,
            DOJ:data.DOJ
        })
        return 'Data added Successfully'
    }catch(e){
        console.log(e.message);
        return `ERROR!: ${e.message}`
    }
}

module.exports = AddUsers;