#!/usr/bin/env node

const http = require('http');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    for (const network of networkInterface) {
      if (network.family === 'IPv4' && !network.internal) {
        return network.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
console.log('🌐 ネットワーク接続テスト');
console.log('========================');
console.log(`Local IP: ${localIP}`);
console.log(`Metro Bundler URL: http://${localIP}:8082`);
console.log(`Expo URL: exp://${localIP}:8082`);

// Test localhost connection
function testConnection(host, port, callback) {
  const req = http.request({
    host: host,
    port: port,
    path: '/',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    console.log(`✅ ${host}:${port} - 接続成功 (${res.statusCode})`);
    callback(true);
  });

  req.on('error', (err) => {
    console.log(`❌ ${host}:${port} - 接続失敗: ${err.message}`);
    callback(false);
  });

  req.on('timeout', () => {
    console.log(`⏱️  ${host}:${port} - タイムアウト`);
    req.destroy();
    callback(false);
  });

  req.end();
}

console.log('\n🔍 接続テスト実行中...\n');

testConnection('localhost', 8082, (success) => {
  if (success) {
    console.log('\n✅ Metro Bundlerが正常に動作しています');
    console.log('\n📱 ExpoGoでの接続方法:');
    console.log(`1. QRコードをスキャン`);
    console.log(`2. または手動でURL入力: exp://${localIP}:8082`);
    console.log('\n🚀 アプリが正常に起動するはずです！');
  } else {
    console.log('\n❌ Metro Bundlerが応答していません');
    console.log('\n🔧 解決方法:');
    console.log('1. npx expo start --tunnel を実行');
    console.log('2. ファイアウォール設定を確認');
    console.log('3. 別のポートを使用: npx expo start --port 8082');
  }
});