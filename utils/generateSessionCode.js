const generateCode = () => {
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for(let i = 0; i < 6; i++){

        code += str[Math.floor(Math.random() * str.length)];
    }

    return code;
}

export default generateCode;