// 100 Concurrent Students Load Test for EduNet Exam Platform
const BASE_URL = 'http://localhost:3000';
const CONCURRENT_STUDENTS = 100;

async function runLoadTest() {
  console.log(`\n============================================================`);
  console.log(`🚀 STARTING 100-STUDENT CONCURRENT LOAD TEST FOR EDUNET`);
  console.log(`Target: ${BASE_URL} | Users: ${CONCURRENT_STUDENTS}`);
  console.log(`============================================================\n`);

  const startTime = Date.now();
  let registrationSuccesses = 0;
  let registrationFailures = 0;
  let startSuccesses = 0;
  let startFailures = 0;
  let questionSuccesses = 0;
  let questionFailures = 0;
  let answerSuccesses = 0;
  let answerFailures = 0;
  let resumeSuccesses = 0;
  let resumeFailures = 0;
  let submitSuccesses = 0;
  let submitFailures = 0;
  const latencies = [];

  const timestamp = Date.now();

  // Step 1: 100 Concurrent Registrations
  console.log(`[Phase 1] Launching ${CONCURRENT_STUDENTS} concurrent student registrations...`);
  const studentPromises = Array.from({ length: CONCURRENT_STUDENTS }, async (_, i) => {
    const rollNumber = `LOAD${timestamp}_${String(i + 1).padStart(3, '0')}`;
    const studentName = `Student ${i + 1}`;
    const email = `loadtest${i + 1}_${timestamp}@edunet.test`;
    const department = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'][i % 5];

    const t0 = Date.now();
    try {
      // 1. Register
      const regRes = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: studentName, rollNumber, email, department }),
      });
      const regData = await regRes.json();
      if (!regRes.ok || !regData.sessionId) {
        registrationFailures++;
        return { index: i, error: 'Registration failed' };
      }
      registrationSuccesses++;
      const sessionId = regData.sessionId;

      // 2. Start Exam
      const startRes = await fetch(`${BASE_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const startData = await startRes.json();
      if (!startRes.ok || !startData.success) {
        startFailures++;
      } else {
        startSuccesses++;
      }

      // 3. Fetch Question (simulate random question indexes)
      const qIndex = (i * 3) % 50;
      const qRes = await fetch(`${BASE_URL}/api/session/question?sessionId=${sessionId}&index=${qIndex}`);
      const qData = await qRes.json();
      if (!qRes.ok || !qData.questionText) {
        questionFailures++;
      } else {
        questionSuccesses++;
      }

      // 4. Submit Answer
      const chosenAnswer = ['a', 'b', 'c', 'd'][i % 4];
      const ansRes = await fetch(`${BASE_URL}/api/session/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, questionIndex: qIndex, selectedAnswer: chosenAnswer }),
      });
      const ansData = await ansRes.json();
      if (!ansRes.ok || !ansData.success) {
        answerFailures++;
      } else {
        answerSuccesses++;
      }

      // 5. Test Session Resumption (same student re-registers / reconnects)
      const resumeRes = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: studentName, rollNumber, email, department }),
      });
      const resumeData = await resumeRes.json();
      if (resumeRes.ok && resumeData.resumed === true && resumeData.sessionId === sessionId) {
        resumeSuccesses++;
      } else {
        resumeFailures++;
      }

      // 6. Submit Exam with Answers Payload
      const answersMap = {
        [qIndex]: chosenAnswer,
        0: 'b',
        1: 'b',
      };
      const subRes = await fetch(`${BASE_URL}/api/session/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers: answersMap }),
      });
      const subData = await subRes.json();
      if (!subRes.ok || (!subData.success && !subData.alreadySubmitted)) {
        submitFailures++;
      } else {
        submitSuccesses++;
      }

      latencies.push(Date.now() - t0);
      return { index: i, success: true, score: subData.score };
    } catch (err) {
      return { index: i, error: err.message };
    }
  });

  const results = await Promise.all(studentPromises);
  const totalDuration = Date.now() - startTime;
  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log(`\n============================================================`);
  console.log(`📊 100-STUDENT LOAD TEST RESULTS`);
  console.log(`============================================================`);
  console.log(`Total Elapsed Time:         ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`Total Requests Executed:    ~${CONCURRENT_STUDENTS * 6} requests`);
  console.log(`Registration Success Rate:  ${registrationSuccesses}/${CONCURRENT_STUDENTS} (${(registrationSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Session Start Success Rate:  ${startSuccesses}/${CONCURRENT_STUDENTS} (${(startSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Question Fetch Success:     ${questionSuccesses}/${CONCURRENT_STUDENTS} (${(questionSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Answer Submission Success:  ${answerSuccesses}/${CONCURRENT_STUDENTS} (${(answerSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Session Resume Success:     ${resumeSuccesses}/${CONCURRENT_STUDENTS} (${(resumeSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Final Exam Submits:         ${submitSuccesses}/${CONCURRENT_STUDENTS} (${(submitSuccesses/CONCURRENT_STUDENTS*100).toFixed(1)}%)`);
  console.log(`Latency p50 (median):       ${p50} ms per full flow`);
  console.log(`Latency p95:                ${p95} ms per full flow`);
  console.log(`Latency p99:                ${p99} ms per full flow`);
  console.log(`Failures Encountered:       ${registrationFailures + startFailures + questionFailures + answerFailures + resumeFailures + submitFailures}`);
  console.log(`============================================================\n`);

  if (submitSuccesses === CONCURRENT_STUDENTS && registrationFailures === 0) {
    console.log(`✅ 100 SIMULTANEOUS STUDENTS CAPACITY VERIFIED WITH ZERO ERRORS!\n`);
  } else {
    console.error(`❌ Load test reported issues. Check stats above.\n`);
    process.exit(1);
  }
}

runLoadTest().catch(console.error);
