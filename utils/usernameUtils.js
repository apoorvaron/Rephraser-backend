function generateUsername(email) {
    const username = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    return username;
}
module.exports = { generateUsername };