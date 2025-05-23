// Deployment helper script
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Data Science Hub - Vercel Deployment Helper');
console.log('===========================================');
console.log('This script will help you deploy to a single Vercel app.');
console.log('Make sure you have the Vercel CLI installed and are logged in.');
console.log('\n');

rl.question('Would you like to proceed with deployment? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    try {
      console.log('\n📦 Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      console.log('\n🔍 Running checks...');
      execSync('npm run lint', { stdio: 'inherit' });
      
      console.log('\n🚀 Deploying to Vercel...');
      execSync('npx vercel --prod', { stdio: 'inherit' });
      
      console.log('\n✅ Deployment complete!');
      console.log('\nTo ensure this is your only active deployment:');
      console.log('1. Go to your Vercel dashboard');
      console.log('2. Remove any other project deployments for this app');
      console.log('3. Set a custom domain if desired');
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      console.log('\nTry running the following commands manually:');
      console.log('1. npm install');
      console.log('2. npx vercel --prod');
    }
  } else {
    console.log('\nDeployment cancelled.');
  }
  
  rl.close();
}); 