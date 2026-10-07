async function runTests() {
  console.log('--- 🧪 STARTING MEDIAGRAB END-TO-END VERIFICATION SUITE ---');
  let passed = 0;
  let total = 0;

  function assert(condition, name, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details}`);
    }
  }

  // Test 1: Health endpoint
  try {
    const res = await fetch('http://localhost:3000/api/health');
    const data = await res.json();
    assert(res.status === 200 && data.status === 'healthy', 'API Health Check', JSON.stringify(data));
    assert(data.compliance.drmBypassBlocked === true && data.compliance.ssrfProtectionEnabled === true, 'Compliance and Security Flags Active');
  } catch (e) {
    assert(false, 'API Health Check', e.message);
  }

  // Test 2: Fetch YouTube media metadata
  try {
    const res = await fetch('http://localhost:3000/api/fetch-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'YouTube Fetch Media Status');
    assert(data.data.platform === 'youtube', 'YouTube Platform Auto-Detected');
    assert(data.data.videoFormats.length >= 4, 'YouTube Video Formats Present (1080p, 720p, 480p, 360p)');
    assert(data.data.audioFormats.length >= 4, 'YouTube Audio Formats Present (320k, 256k, 192k, 128k)');
    console.log('   ℹ️ Video Title:', data.data.title);
    console.log('   ℹ️ Duration:', data.data.durationFormatted);
  } catch (e) {
    assert(false, 'YouTube Fetch Media', e.message);
  }

  // Test 3: Fetch Instagram media metadata
  try {
    const res = await fetch('http://localhost:3000/api/fetch-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.instagram.com/reel/CUb3t7LL5_2/' }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'Instagram Fetch Media Status');
    assert(data.data.platform === 'instagram', 'Instagram Platform Auto-Detected');
    console.log('   ℹ️ Instagram Title:', data.data.title);
  } catch (e) {
    assert(false, 'Instagram Fetch Media', e.message);
  }

  // Test 4: SSRF & security validation
  try {
    const res = await fetch('http://localhost:3000/api/fetch-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://169.254.169.254/latest/meta-data/' }),
    });
    const data = await res.json();
    assert(res.status === 422 && data.success === false, 'SSRF Attack Blocked (Cloud Metadata IP)');
  } catch (e) {
    assert(false, 'SSRF Attack Blocked', e.message);
  }

  // Test 5: Localhost loopback SSRF validation
  try {
    const res = await fetch('http://localhost:3000/api/fetch-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://127.0.0.1:8080/admin' }),
    });
    const data = await res.json();
    assert(res.status === 422 && data.success === false, 'SSRF Attack Blocked (Localhost 127.0.0.1)');
  } catch (e) {
    assert(false, 'SSRF Attack Blocked', e.message);
  }

  // Test 6: Video stream download endpoint
  try {
    const res = await fetch('http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=aqz-KE-bpKQ&formatId=video_720p&mediaType=video');
    const disposition = res.headers.get('content-disposition') || '';
    const contentType = res.headers.get('content-type') || '';
    assert(res.status === 200, 'Video Download Stream HTTP 200');
    assert(contentType.includes('video/mp4'), 'Video Download Content-Type is video/mp4');
    assert(disposition.includes('attachment'), 'Content-Disposition includes attachment header');
    console.log('   ℹ️ Content-Disposition:', disposition);
  } catch (e) {
    assert(false, 'Video Download Stream', e.message);
  }

  // Test 7: Audio stream download endpoint
  try {
    const res = await fetch('http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=aqz-KE-bpKQ&formatId=audio_320k&mediaType=audio');
    const disposition = res.headers.get('content-disposition') || '';
    const contentType = res.headers.get('content-type') || '';
    assert(res.status === 200, 'Audio Download Stream HTTP 200');
    assert(contentType.includes('audio/'), 'Audio Download Content-Type is audio stream');
    assert(disposition.includes('attachment'), 'Audio Content-Disposition includes attachment');
  } catch (e) {
    assert(false, 'Audio Download Stream', e.message);
  }

  // Test 8: Frontend page rendering
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    assert(res.status === 200, 'Frontend Homepage Render Status 200');
    assert(html.includes('KangarooYT') || html.includes('Kangaroo'), 'Frontend contains KangarooYT Brand Title');
    assert(html.includes('Paste video or reel URL here'), 'Frontend contains Large URL Input');
    assert(html.includes('Only download content you have permission to download'), 'Compliance Notice Present');
  } catch (e) {
    assert(false, 'Frontend Page Render', e.message);
  }

  // Test 9: Real download from user-provided arbitrary YouTube URL
  try {
    console.log('   Testing arbitrary user-given YouTube URL download...');
    const res = await fetch('http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&formatId=video_360p&mediaType=video');
    const disposition = res.headers.get('content-disposition') || '';
    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length') || '0';
    assert(res.status === 200, 'Arbitrary YouTube URL Download Status 200');
    assert(contentType.includes('video/mp4'), 'Arbitrary URL Content-Type is video/mp4');
    assert(disposition.includes('Me_at_the_zoo') || disposition.includes('Me at the zoo'), 'Filename corresponds to user-given video title');
    assert(parseInt(contentLength, 10) > 500000, `Downloaded real video bytes (${contentLength})`);
    console.log('   ℹ️ Content-Disposition:', disposition);
    console.log('   ℹ️ Content-Length:', contentLength);
  } catch (e) {
    assert(false, 'Arbitrary YouTube URL Download', e.message);
  }

  // Test 10: Real download from user-provided Instagram Reel URL
  try {
    console.log('   Testing arbitrary user-given Instagram Reel download...');
    const res = await fetch('http://localhost:3000/api/download?url=' + encodeURIComponent('https://www.instagram.com/reel/Ddv5g5PT5_r/') + '&formatId=ig_video_1080p&mediaType=video');
    const disposition = res.headers.get('content-disposition') || '';
    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length') || '0';
    assert(res.status === 200, 'Arbitrary Instagram Reel Download Status 200');
    assert(contentType.includes('video/mp4'), 'Instagram Reel Content-Type is video/mp4');
    assert(disposition.includes('Video_by_vanshu_662') || disposition.includes('vanshu'), 'Filename corresponds to Instagram Reel title');
    assert(parseInt(contentLength, 10) > 1000000, `Downloaded real Instagram video bytes (${contentLength})`);
    console.log('   ℹ️ Instagram Content-Disposition:', disposition);
    console.log('   ℹ️ Instagram Content-Length:', contentLength);
  } catch (e) {
    assert(false, 'Arbitrary Instagram Reel Download', e.message);
  }

  console.log(`\n🎉 RESULTS: ${passed}/${total} TESTS PASSED!`);
}

runTests();

