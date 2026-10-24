// Makes the ADMIN_PASSWORD_HASH value for the owner login.
// Usage: npm run admin:password -- "your new password"
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password || password.length < 10) {
  console.error('Give a password of at least 10 characters:  npm run admin:password -- "your new password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log("\nFor your .env file (dollar signs escaped):\n");
console.log(`ADMIN_PASSWORD_HASH="${hash.replaceAll("$", "\\$")}"`);
console.log("\nFor Vercel or another host's environment settings (paste as-is):\n");
console.log(hash);
console.log("");
