const User = require("../models/user");
const VerifyEmail = require("../models/verify-email");
const nodemailer = require("nodemailer");

function generateHashCode () {
    return Math.random().toString(35).substring(2,15) + Math.random().toString(35).substring(2,15)
}

function generateMailHtml (code) {
    return `<div><table><tr>아래 코드를 입력해주세요</tr><tr style="background:#eeeeee; padding:1em;display:block;">${code}</tr></table></div>`
}

/**
 *
 * @param option
 * @param option.generateCode: 이메일 인증 코드 생성하는 함수 -> generateHashCode를 기본 함수로 사용함
 * @param option.to 메일 수신자
 * @param option.subject: 메일 제목
 * @returns {Promise<void>}
 */
exports.sendEmailCode = async function (option) {
    try {
        if(option.to === undefined || typeof option.to !== 'string') throw new Error("string option.to is not present");

        let verifyEmail = await VerifyEmail.findOne({ email: option.to });
        if(verifyEmail !== null
            && Date.now() - verifyEmail.codeSentAt <= 1000) throw new Error("code already sent in 1minute");

        let { generateCode, generateHtml, ..._mailOptions } = option;

        generateCode = generateCode || generateHashCode;
        generateHtml = generateHtml || generateMailHtml;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "skfk0135@gmail.com",
                pass: "xhdzmsdkdl!@#"
            }
        });

        const code = generateCode();
        const html = generateHtml(code);
        const subject = "TicketPass 인증 메일";

        const mailOptions = {
            from: "skfk0135@gmail.com",
            ..._mailOptions,
            subject,
            html
        }

        await transporter.sendMail(mailOptions);


        verifyEmail = verifyEmail || {
            email: option.to,
            isVerified: false,
            code
        }
        verifyEmail.codeSentAt = Date.now()

        const id = verifyEmail._id;
        delete verifyEmail._id
        await VerifyEmail.updateOne({_id: id}, verifyEmail, {upsert: true, setDefaultsOnInsert: true});
    } catch (err) {
        throw err;
    }
}

/**
 *
 * @param signUpData
 * @param signUpData.email
 * @param signUpData.password
 * @param signUpData.code
 * @returns {Promise<void>}
 */
exports.signUp = async function (signUpData) {
    try {
        if(signUpData.email === undefined || typeof signUpData.email !== 'string') throw new Error('string signUpData.email is not present')
        if(signUpData.password === undefined || typeof signUpData.password !== 'string') throw new Error('string signUpData.passowrd is not present')
        if(signUpData.code === undefined || typeof signUpData.code !== 'string') throw new Error('string signUpData.code is not present')

        const verifyEmail = await VerifyEmail.findOne({ email: signUpData.email, code: signUpData.code });
        if(verifyEmail === null) throw new Error("invalid code");

        if(verifyEmail.isVerified) throw new Error("email is already verified");

        verifyEmail.isVerified = true
        await VerifyEmail.update({id: verifyEmail._id}, verifyEmail);

        const user = await User.create(signUpData);
        return user;
    } catch (err) {
        throw err;
    }
}