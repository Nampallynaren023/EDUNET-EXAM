// EduNet – Simplified & Fast-Paced Question Bank
// Designed for 26-second per-question assessment
// SERVER-SIDE ONLY — never import in client components

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  section: 'behavioral' | 'situational' | 'technical' | 'career';
  topic: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
};

// ─────────────────────────────────────────────────────────────────
// SECTION A — BEHAVIORAL (20 simple questions, 10 selected per exam)
// ─────────────────────────────────────────────────────────────────
export const behavioralQuestions: Question[] = [
  {
    id: 'B01', section: 'behavioral', topic: 'Communication',
    question: 'What is the most effective element of active listening?',
    options: [
      { id: 'a', text: 'Interrupting to give your opinion' },
      { id: 'b', text: 'Paying attention and clarifying doubts' },
      { id: 'c', text: 'Looking at your phone while listening' },
      { id: 'd', text: 'Remaining completely silent' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B02', section: 'behavioral', topic: 'Teamwork',
    question: 'When working in a team project, how should tasks be divided?',
    options: [
      { id: 'a', text: 'One person does everything' },
      { id: 'b', text: 'Based on each member\'s skills and strengths' },
      { id: 'c', text: 'Leave all hard tasks unassigned' },
      { id: 'd', text: 'Give all tasks to the junior member' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B03', section: 'behavioral', topic: 'Time Management',
    question: 'What is the best way to handle multiple urgent deadlines?',
    options: [
      { id: 'a', text: 'Panic and do nothing' },
      { id: 'b', text: 'Prioritize by urgency and importance' },
      { id: 'c', text: 'Work on tasks in random order' },
      { id: 'd', text: 'Ask for extensions on all tasks' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B04', section: 'behavioral', topic: 'Accountability',
    question: 'If you make a mistake in your team report, what should you do?',
    options: [
      { id: 'a', text: 'Blame another team member' },
      { id: 'b', text: 'Hide the error and hope no one notices' },
      { id: 'c', text: 'Acknowledge it immediately and correct it' },
      { id: 'd', text: 'Delete the entire report' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'B05', section: 'behavioral', topic: 'Constructive Feedback',
    question: 'How should you respond when receiving constructive criticism?',
    options: [
      { id: 'a', text: 'Take it personally and argue' },
      { id: 'b', text: 'Listen calmly and use it to improve' },
      { id: 'c', text: 'Ignore the feedback completely' },
      { id: 'd', text: 'Criticize the other person back' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B06', section: 'behavioral', topic: 'Adaptability',
    question: 'What is adaptability in a workplace?',
    options: [
      { id: 'a', text: 'Refusing to learn new software' },
      { id: 'b', text: 'Adjusting positively to new requirements' },
      { id: 'c', text: 'Changing jobs every two months' },
      { id: 'd', text: 'Ignoring project guideline updates' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B07', section: 'behavioral', topic: 'Punctuality',
    question: 'Why is punctuality important in meetings?',
    options: [
      { id: 'a', text: 'It shows respect for everyone\'s time' },
      { id: 'b', text: 'It is only necessary for the team lead' },
      { id: 'c', text: 'It allows you to leave early' },
      { id: 'd', text: 'It has no impact on team performance' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B08', section: 'behavioral', topic: 'Conflict Resolution',
    question: 'What is the best way to resolve an argument with a teammate?',
    options: [
      { id: 'a', text: 'Stop speaking to them completely' },
      { id: 'b', text: 'Discuss the issue calmly in private' },
      { id: 'c', text: 'Argue loudly in the team group chat' },
      { id: 'd', text: 'Complain to the client directly' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B09', section: 'behavioral', topic: 'Professional Attitude',
    question: 'What defines a professional work attitude?',
    options: [
      { id: 'a', text: 'Doing the minimum work possible' },
      { id: 'b', text: 'Reliability, respect, and enthusiasm to learn' },
      { id: 'c', text: 'Always agreeing even when something is wrong' },
      { id: 'd', text: 'Focusing solely on personal gain' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B10', section: 'behavioral', topic: 'Stress Management',
    question: 'How should you manage high work pressure?',
    options: [
      { id: 'a', text: 'Take short breaks and organize your tasks' },
      { id: 'b', text: 'Work continuously without any sleep' },
      { id: 'c', text: 'Vent angrily to your teammates' },
      { id: 'd', text: 'Give up on all pending deadlines' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B11', section: 'behavioral', topic: 'Decision Making',
    question: 'Good decision-making in a team is based on:',
    options: [
      { id: 'a', text: 'Personal emotions and guesses' },
      { id: 'b', text: 'Facts, data, and team inputs' },
      { id: 'c', text: 'Random coin tosses' },
      { id: 'd', text: 'Whatever is fastest without thinking' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B12', section: 'behavioral', topic: 'Workplace Ethics',
    question: 'Sharing confidential company files on social media is:',
    options: [
      { id: 'a', text: 'Encouraged to gain followers' },
      { id: 'b', text: 'A serious breach of company policy' },
      { id: 'c', text: 'Allowed if done anonymously' },
      { id: 'd', text: 'Acceptable on weekends' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B13', section: 'behavioral', topic: 'Leadership',
    question: 'What is a key quality of a good team leader?',
    options: [
      { id: 'a', text: 'Taking credit for everyone\'s work' },
      { id: 'b', text: 'Supporting and guiding team members' },
      { id: 'c', text: 'Never listening to feedback' },
      { id: 'd', text: 'Assigning work and leaving completely' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B14', section: 'behavioral', topic: 'Initiative',
    question: 'Showing initiative at work means:',
    options: [
      { id: 'a', text: 'Waiting for orders for every small step' },
      { id: 'b', text: 'Proactively finding solutions to problems' },
      { id: 'c', text: 'Doing tasks without permission carelessly' },
      { id: 'd', text: 'Interrupting other projects' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B15', section: 'behavioral', topic: 'Goal Setting',
    question: 'SMART goals must be Specific, Measurable, Achievable, Relevant, and:',
    options: [
      { id: 'a', text: 'Time-bound' },
      { id: 'b', text: 'Temporary' },
      { id: 'c', text: 'Theoretical' },
      { id: 'd', text: 'Tedious' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B16', section: 'behavioral', topic: 'Non-verbal Communication',
    question: 'Which non-verbal cue shows confidence during an interview?',
    options: [
      { id: 'a', text: 'Slouching and looking down' },
      { id: 'b', text: 'Good posture and appropriate eye contact' },
      { id: 'c', text: 'Fidgeting with your pen constantly' },
      { id: 'd', text: 'Arms tightly crossed with a frown' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'B17', section: 'behavioral', topic: 'Empathy',
    question: 'Empathy in the workplace helps to:',
    options: [
      { id: 'a', text: 'Understand and support colleagues\' perspectives' },
      { id: 'b', text: 'Manipulate team members' },
      { id: 'c', text: 'Avoid doing any individual work' },
      { id: 'd', text: 'Judge coworkers quickly' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B18', section: 'behavioral', topic: 'Continuous Learning',
    question: 'Why should professionals upgrade their skills regularly?',
    options: [
      { id: 'a', text: 'To stay relevant with changing industry trends' },
      { id: 'b', text: 'Only to collect certificates' },
      { id: 'c', text: 'It has no real benefit' },
      { id: 'd', text: 'To show off on social media' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B19', section: 'behavioral', topic: 'Integrity',
    question: 'Workplace integrity means:',
    options: [
      { id: 'a', text: 'Being honest and having strong moral principles' },
      { id: 'b', text: 'Doing what is popular rather than right' },
      { id: 'c', text: 'Covering up project delays from clients' },
      { id: 'd', text: 'Saying yes to everything' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'B20', section: 'behavioral', topic: 'Collaboration',
    question: 'Successful collaboration requires:',
    options: [
      { id: 'a', text: 'Clear communication and shared goals' },
      { id: 'b', text: 'Competition between teammates' },
      { id: 'c', text: 'Keeping project files secret' },
      { id: 'd', text: 'Zero disagreement at all times' },
    ],
    correctAnswer: 'a',
  },
];

// ─────────────────────────────────────────────────────────────────
// SECTION B — SITUATIONAL (20 simple questions, 10 selected per exam)
// ─────────────────────────────────────────────────────────────────
export const situationalQuestions: Question[] = [
  {
    id: 'S01', section: 'situational', topic: 'Missed Meeting',
    question: 'You realize you missed a scheduled team call. What is your first step?',
    options: [
      { id: 'a', text: 'Act like the meeting never happened' },
      { id: 'b', text: 'Apologize to the host and ask for notes' },
      { id: 'c', text: 'Blame your computer or internet' },
      { id: 'd', text: 'Wait until someone asks you about it' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S02', section: 'situational', topic: 'Unclear Instructions',
    question: 'Your supervisor assigns you a task with unclear instructions. What do you do?',
    options: [
      { id: 'a', text: 'Guess and hope for the best' },
      { id: 'b', text: 'Ask polite questions to clarify requirements' },
      { id: 'c', text: 'Ignore the task completely' },
      { id: 'd', text: 'Complain to fellow interns' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S03', section: 'situational', topic: 'Deadline Risk',
    question: 'You foresee that your module will be delayed by one day. What should you do?',
    options: [
      { id: 'a', text: 'Inform your lead early with an updated time' },
      { id: 'b', text: 'Wait until the deadline has passed to speak' },
      { id: 'c', text: 'Submit unfinished, broken code' },
      { id: 'd', text: 'Turn off your phone and take leave' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S04', section: 'situational', topic: 'Helping Teammates',
    question: 'You finish your work early while your teammate is overloaded. What is the best step?',
    options: [
      { id: 'a', text: 'Leave early without telling anyone' },
      { id: 'b', text: 'Offer to assist your teammate' },
      { id: 'c', text: 'Boast about how fast you finished' },
      { id: 'd', text: 'Watch videos at your desk' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S05', section: 'situational', topic: 'Client Disagreement',
    question: 'A client requests a change that contradicts the agreed scope. How do you respond?',
    options: [
      { id: 'a', text: 'Argue aggressively with the client' },
      { id: 'b', text: 'Politely explain the scope and discuss options' },
      { id: 'c', text: 'Accept all changes without checking timeline' },
      { id: 'd', text: 'Block the client\'s email address' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S06', section: 'situational', topic: 'Bug in Production',
    question: 'A critical bug is discovered right after release. What is the priority?',
    options: [
      { id: 'a', text: 'Find who wrote the code to blame them' },
      { id: 'b', text: 'Work together to identify and fix the issue' },
      { id: 'c', text: 'Pretend the bug does not exist' },
      { id: 'd', text: 'Delete the database' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S07', section: 'situational', topic: 'Disagreement on Tech Stack',
    question: 'Two teammates debate which tool to use. How should the team decide?',
    options: [
      { id: 'a', text: 'Have an arm wrestling match' },
      { id: 'b', text: 'Evaluate both tools based on project needs' },
      { id: 'c', text: 'Pick whichever tool is oldest' },
      { id: 'd', text: 'Refuse to work until someone gives up' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S08', section: 'situational', topic: 'Group Discussion',
    question: 'During a group discussion, someone interrupts you rudely. How should you react?',
    options: [
      { id: 'a', text: 'Shout louder to overpower them' },
      { id: 'b', text: 'Stay calm and conclude your point politely' },
      { id: 'c', text: 'Walk out of the room immediately' },
      { id: 'd', text: 'Insult the speaker personally' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S09', section: 'situational', topic: 'Work Overload',
    question: 'Your manager gives you three new tasks when you are already full. What should you do?',
    options: [
      { id: 'a', text: 'Say yes to all and fail all deadlines' },
      { id: 'b', text: 'Discuss priorities and adjust timelines' },
      { id: 'c', text: 'Silently reject the manager\'s emails' },
      { id: 'd', text: 'Resign immediately' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S10', section: 'situational', topic: 'Confidential Information',
    question: 'A friend asks you for confidential details about an upcoming campus drive. You should:',
    options: [
      { id: 'a', text: 'Politely refuse to share confidential data' },
      { id: 'b', text: 'Share everything on WhatsApp' },
      { id: 'c', text: 'Sell the questions for money' },
      { id: 'd', text: 'Post the questions on your Instagram' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S11', section: 'situational', topic: 'Technical Interview',
    question: 'If you do not know the answer to a question in an interview, what is best?',
    options: [
      { id: 'a', text: 'Make up a fake answer confidently' },
      { id: 'b', text: 'Admit honestly and explain how you would find out' },
      { id: 'c', text: 'Remain totally silent for 2 minutes' },
      { id: 'd', text: 'Criticize the interviewer for asking it' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S12', section: 'situational', topic: 'Presentation Tech Glitch',
    question: 'During your project presentation, the projector stops working. How do you react?',
    options: [
      { id: 'a', text: 'Panic and cancel your presentation' },
      { id: 'b', text: 'Stay composed and present verbally while checking' },
      { id: 'c', text: 'Blame the event organizers loudly' },
      { id: 'd', text: 'Stand silently until it is fixed' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S13', section: 'situational', topic: 'New Team Member',
    question: 'A new junior joins your project team. What is the most welcoming action?',
    options: [
      { id: 'a', text: 'Introduce them to the project and guide them' },
      { id: 'b', text: 'Ignore them until they prove themselves' },
      { id: 'c', text: 'Dump all boring tasks onto them' },
      { id: 'd', text: 'Give them incorrect file links' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S14', section: 'situational', topic: 'Negative Feedback on Presentation',
    question: 'Your mentor tells you your presentation slides were cluttered. How do you respond?',
    options: [
      { id: 'a', text: 'Thank them, simplify the slides, and practice' },
      { id: 'b', text: 'Defend your slides and reject the feedback' },
      { id: 'c', text: 'Refuse to present ever again' },
      { id: 'd', text: 'Complain that the mentor is biased' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S15', section: 'situational', topic: 'Wrong Email Recipient',
    question: 'You accidentally sent an internal draft to a client. What should you do?',
    options: [
      { id: 'a', text: 'Send an immediate polite apology and recall notice' },
      { id: 'b', text: 'Pretend your email was hacked' },
      { id: 'c', text: 'Block the client immediately' },
      { id: 'd', text: 'Do nothing and hope they do not read it' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S16', section: 'situational', topic: 'Differing Opinions',
    question: 'A colleague proposes an idea you believe will not work. How should you respond?',
    options: [
      { id: 'a', text: 'Say "That is stupid" in front of everyone' },
      { id: 'b', text: 'Share your perspective politely with reasons' },
      { id: 'c', text: 'Agree in the meeting, then criticize behind their back' },
      { id: 'd', text: 'Interrupt them midway through their idea' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'S17', section: 'situational', topic: 'Urgent Unplanned Task',
    question: 'Your lead gives you a high-priority task 15 minutes before your shift ends. What do you do?',
    options: [
      { id: 'a', text: 'Check urgency and agree on a reasonable plan' },
      { id: 'b', text: 'Walk out without answering' },
      { id: 'c', text: 'Start crying at your desk' },
      { id: 'd', text: 'Delete the task email' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S18', section: 'situational', topic: 'Code Review Comments',
    question: 'A senior engineer leaves several change requests on your pull request. You should:',
    options: [
      { id: 'a', text: 'Review the comments, learn, and update the code' },
      { id: 'b', text: 'Merge the code anyway without changes' },
      { id: 'c', text: 'Delete your code repository in anger' },
      { id: 'd', text: 'Argue on every single comment' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S19', section: 'situational', topic: 'Credit Sharing',
    question: 'Your project won an award mainly because of team collaboration. You should:',
    options: [
      { id: 'a', text: 'Acknowledge and share credit with the entire team' },
      { id: 'b', text: 'Claim you did 100% of the work yourself' },
      { id: 'c', text: 'Refuse to celebrate with the team' },
      { id: 'd', text: 'Exclude junior members from the announcement' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'S20', section: 'situational', topic: 'Remote Work Meeting',
    question: 'You have background noise during a team Zoom call. What is best practice?',
    options: [
      { id: 'a', text: 'Keep your microphone muted when not speaking' },
      { id: 'b', text: 'Shout over the noise so people can hear you' },
      { id: 'c', text: 'Turn your computer volume to maximum' },
      { id: 'd', text: 'Play loud music to mask the noise' },
    ],
    correctAnswer: 'a',
  },
];

// ─────────────────────────────────────────────────────────────────
// SECTION C — TECHNICAL & IT BASICS (20 simple questions, 10 selected per exam)
// ─────────────────────────────────────────────────────────────────
export const technicalQuestions: Question[] = [
  {
    id: 'T01', section: 'technical', topic: 'Web Concepts',
    question: 'What does "HTTP 404" status code mean?',
    options: [
      { id: 'a', text: 'Page or resource not found' },
      { id: 'b', text: 'Server is overloaded' },
      { id: 'c', text: 'Password is incorrect' },
      { id: 'd', text: 'Download completed' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T02', section: 'technical', topic: 'APIs',
    question: 'What does "API" stand for in software development?',
    options: [
      { id: 'a', text: 'Application Programming Interface' },
      { id: 'b', text: 'Automated Program Identifier' },
      { id: 'c', text: 'Advanced Protocol Integration' },
      { id: 'd', text: 'Apple Phone Interface' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T03', section: 'technical', topic: 'Version Control',
    question: 'In Git, which command creates a new local branch?',
    options: [
      { id: 'a', text: 'git branch <branch-name>' },
      { id: 'b', text: 'git delete' },
      { id: 'c', text: 'git exit' },
      { id: 'd', text: 'git pause' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T04', section: 'technical', topic: 'Version Control',
    question: 'What is a "Pull Request" (PR) in GitHub?',
    options: [
      { id: 'a', text: 'A request to review code before merging' },
      { id: 'b', text: 'A request to delete a repository' },
      { id: 'c', text: 'An error message from Git' },
      { id: 'd', text: 'A billing request from GitHub' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T05', section: 'technical', topic: 'Cloud Storage',
    question: 'Which of the following is a cloud storage service?',
    options: [
      { id: 'a', text: 'Google Drive' },
      { id: 'b', text: 'VLC Media Player' },
      { id: 'c', text: 'Notepad' },
      { id: 'd', text: 'MS Paint' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T06', section: 'technical', topic: 'Cybersecurity',
    question: 'Which of the following is the strongest password practice?',
    options: [
      { id: 'a', text: 'Using "12345678"' },
      { id: 'b', text: 'Using your pet\'s name alone' },
      { id: 'c', text: 'A mix of letters, numbers, and symbols' },
      { id: 'd', text: 'Using your phone number everywhere' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'T07', section: 'technical', topic: 'Cybersecurity',
    question: 'What is "Two-Factor Authentication" (2FA)?',
    options: [
      { id: 'a', text: 'Using two different computers' },
      { id: 'b', text: 'A two-step verification process for security' },
      { id: 'c', text: 'Having two passwords for two accounts' },
      { id: 'd', text: 'Logging in twice in one day' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'T08', section: 'technical', topic: 'Hardware Basics',
    question: 'What does "RAM" do in a computer?',
    options: [
      { id: 'a', text: 'Provides fast temporary memory for active tasks' },
      { id: 'b', text: 'Permanently prints documents' },
      { id: 'c', text: 'Protects the screen from scratches' },
      { id: 'd', text: 'Connects the computer to power' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T09', section: 'technical', topic: 'Networking',
    question: 'What is the primary role of a Firewall in a network?',
    options: [
      { id: 'a', text: 'To block unauthorized network access' },
      { id: 'b', text: 'To increase typing speed' },
      { id: 'c', text: 'To cool down the computer fans' },
      { id: 'd', text: 'To clean dust from the hardware' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T10', section: 'technical', topic: 'Web Basics',
    question: 'What does "URL" stand for?',
    options: [
      { id: 'a', text: 'Uniform Resource Locator' },
      { id: 'b', text: 'Universal Routing Link' },
      { id: 'c', text: 'Unified Radio Link' },
      { id: 'd', text: 'User Response Log' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T11', section: 'technical', topic: 'Operating Systems',
    question: 'Which of the following is an open-source operating system?',
    options: [
      { id: 'a', text: 'Linux' },
      { id: 'b', text: 'Windows' },
      { id: 'c', text: 'macOS' },
      { id: 'd', text: 'iOS' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T12', section: 'technical', topic: 'Documentation',
    question: 'What is the main purpose of a README file in a project?',
    options: [
      { id: 'a', text: 'To introduce the project and provide setup instructions' },
      { id: 'b', text: 'To store user passwords' },
      { id: 'c', text: 'To run automated tests' },
      { id: 'd', text: 'To act as a license key' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T13', section: 'technical', topic: 'Web Development',
    question: 'Which language gives structure to web pages?',
    options: [
      { id: 'a', text: 'HTML' },
      { id: 'b', text: 'CSS' },
      { id: 'c', text: 'SQL' },
      { id: 'd', text: 'Python' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T14', section: 'technical', topic: 'Web Development',
    question: 'Which language is primarily used for styling web pages?',
    options: [
      { id: 'a', text: 'CSS' },
      { id: 'b', text: 'HTML' },
      { id: 'c', text: 'C++' },
      { id: 'd', text: 'Java' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T15', section: 'technical', topic: 'Databases',
    question: 'What is SQL used for?',
    options: [
      { id: 'a', text: 'Managing and querying relational databases' },
      { id: 'b', text: 'Creating graphical animations' },
      { id: 'c', text: 'Designing company logos' },
      { id: 'd', text: 'Sending emails' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T16', section: 'technical', topic: 'Software Testing',
    question: 'What is "Unit Testing"?',
    options: [
      { id: 'a', text: 'Testing individual units/components of code' },
      { id: 'b', text: 'Testing the entire internet' },
      { id: 'c', text: 'Testing the monitor screen colors' },
      { id: 'd', text: 'Testing typing speed' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T17', section: 'technical', topic: 'Browser Basics',
    question: 'What does clearing your browser cache do?',
    options: [
      { id: 'a', text: 'Removes stored website temporary files' },
      { id: 'b', text: 'Deletes your operating system' },
      { id: 'c', text: 'Turns off your Wi-Fi' },
      { id: 'd', text: 'Cancels your internet subscription' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T18', section: 'technical', topic: 'Agile & Scrum',
    question: 'In Agile software development, what is a "Sprint"?',
    options: [
      { id: 'a', text: 'A short, fixed period to complete specific tasks' },
      { id: 'b', text: 'A running competition in the office' },
      { id: 'c', text: 'A 5-year project plan' },
      { id: 'd', text: 'An urgent meeting with HR' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T19', section: 'technical', topic: 'Data Security',
    question: 'What is "Phishing"?',
    options: [
      { id: 'a', text: 'Fraudulent attempts to steal sensitive user data' },
      { id: 'b', text: 'Fishing games installed on PCs' },
      { id: 'c', text: 'Connecting computers via cables' },
      { id: 'd', text: 'Backing up files to a flash drive' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'T20', section: 'technical', topic: 'Code Quality',
    question: 'What is "Code Refactoring"?',
    options: [
      { id: 'a', text: 'Improving code structure without changing behavior' },
      { id: 'b', text: 'Deleting all comments from code' },
      { id: 'c', text: 'Writing code in a notepad only' },
      { id: 'd', text: 'Changing the programming language completely' },
    ],
    correctAnswer: 'a',
  },
];

// ─────────────────────────────────────────────────────────────────
// SECTION D — CAREER READINESS (36 simple questions, 20 selected per exam)
// ─────────────────────────────────────────────────────────────────
export const careerQuestions: Question[] = [
  // LinkedIn (5 questions -> 3 selected)
  {
    id: 'C01', section: 'career', topic: 'LinkedIn',
    question: 'What makes an ideal LinkedIn profile picture?',
    options: [
      { id: 'a', text: 'A clear, professional headshot' },
      { id: 'b', text: 'A cartoon character avatar' },
      { id: 'c', text: 'A dark group photo from a party' },
      { id: 'd', text: 'Leaving the profile photo blank' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C02', section: 'career', topic: 'LinkedIn',
    question: 'What should be written in your LinkedIn Headline?',
    options: [
      { id: 'a', text: 'Your core skills and career focus' },
      { id: 'b', text: 'Your favorite movie quotes' },
      { id: 'c', text: 'Your home address' },
      { id: 'd', text: 'Random emojis only' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C03', section: 'career', topic: 'LinkedIn',
    question: 'Why should you connect with college alumni on LinkedIn?',
    options: [
      { id: 'a', text: 'For career guidance and networking opportunities' },
      { id: 'b', text: 'To spam their message inbox' },
      { id: 'c', text: 'It has no real purpose' },
      { id: 'd', text: 'To ask them for personal favors' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C04', section: 'career', topic: 'LinkedIn',
    question: 'What is the purpose of the "Featured" section on LinkedIn?',
    options: [
      { id: 'a', text: 'Showcasing key projects, certificates, and achievements' },
      { id: 'b', text: 'Displaying your personal vacation photos' },
      { id: 'c', text: 'Listing family members' },
      { id: 'd', text: 'Hiding your work experience' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C05', section: 'career', topic: 'LinkedIn',
    question: 'How often is it recommended to post or engage on LinkedIn?',
    options: [
      { id: 'a', text: 'Regularly with insightful and relevant content' },
      { id: 'b', text: '50 times every hour' },
      { id: 'c', text: 'Only once every five years' },
      { id: 'd', text: 'Never engage with anyone' },
    ],
    correctAnswer: 'a',
  },

  // ATS Resume (5 questions -> 3 selected)
  {
    id: 'C06', section: 'career', topic: 'ATS Resume',
    question: 'What does "ATS" stand for in campus hiring?',
    options: [
      { id: 'a', text: 'Applicant Tracking System' },
      { id: 'b', text: 'Automated Technical Screen' },
      { id: 'c', text: 'Applied Training Standard' },
      { id: 'd', text: 'Academic Test Score' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C07', section: 'career', topic: 'ATS Resume',
    question: 'Which file format is safest for ATS parsing?',
    options: [
      { id: 'a', text: 'Standard Clean PDF or DOCX' },
      { id: 'b', text: 'Image file (JPG/PNG)' },
      { id: 'c', text: 'Photoshop file (PSD)' },
      { id: 'd', text: 'ZIP compressed folder' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C08', section: 'career', topic: 'ATS Resume',
    question: 'Why should you match resume keywords to the job description?',
    options: [
      { id: 'a', text: 'To improve your ATS ranking for that role' },
      { id: 'b', text: 'To make the resume longer' },
      { id: 'c', text: 'It is required by law' },
      { id: 'd', text: 'To confuse the recruiter' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C09', section: 'career', topic: 'ATS Resume',
    question: 'What is the recommended resume length for a fresher?',
    options: [
      { id: 'a', text: '1 page (clean and concise)' },
      { id: 'b', text: '5 to 7 pages' },
      { id: 'c', text: '10 pages with all school certificates' },
      { id: 'd', text: 'A small paragraph of 2 lines' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C10', section: 'career', topic: 'ATS Resume',
    question: 'Which item should be AVOIDED on an ATS-friendly resume?',
    options: [
      { id: 'a', text: 'Complex multi-column tables and text boxes' },
      { id: 'b', text: 'Contact email address' },
      { id: 'c', text: 'College degree information' },
      { id: 'd', text: 'Technical skills list' },
    ],
    correctAnswer: 'a',
  },

  // Interview Preparation (5 questions -> 3 selected)
  {
    id: 'C11', section: 'career', topic: 'Interview Preparation',
    question: 'What does the "STAR" method in interview answers stand for?',
    options: [
      { id: 'a', text: 'Situation, Task, Action, Result' },
      { id: 'b', text: 'Skill, Talent, Attitude, Readiness' },
      { id: 'c', text: 'Speak, Think, Answer, Repeat' },
      { id: 'd', text: 'Simple, Technical, Accurate, Rapid' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C12', section: 'career', topic: 'Interview Preparation',
    question: 'When an interviewer asks "Do you have any questions for us?", you should:',
    options: [
      { id: 'a', text: 'Ask thoughtful questions about the role or team' },
      { id: 'b', text: 'Say "No, I just want to leave"' },
      { id: 'c', text: 'Ask when you can take your next vacation' },
      { id: 'd', text: 'Ask how much profit the CEO makes' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C13', section: 'career', topic: 'Interview Preparation',
    question: 'How should you dress for a campus placement interview?',
    options: [
      { id: 'a', text: 'Neat professional formal attire' },
      { id: 'b', text: 'Casual shorts and flip-flops' },
      { id: 'c', text: 'Gym clothes and sneakers' },
      { id: 'd', text: 'Party costume' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C14', section: 'career', topic: 'Interview Preparation',
    question: 'What is the best way to prepare for a technical interview?',
    options: [
      { id: 'a', text: 'Review core concepts, practice coding, and mock interviews' },
      { id: 'b', text: 'Memorize answers without understanding' },
      { id: 'c', text: 'Hope that only easy questions are asked' },
      { id: 'd', text: 'Study only 10 minutes before the interview' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C15', section: 'career', topic: 'Interview Preparation',
    question: 'In an HR interview, the question "Tell me about yourself" is meant to:',
    options: [
      { id: 'a', text: 'Give a brief overview of your background, skills, and goals' },
      { id: 'b', text: 'Recite your entire life story from birth' },
      { id: 'c', text: 'List all movies you have watched' },
      { id: 'd', text: 'Complain about your college faculty' },
    ],
    correctAnswer: 'a',
  },

  // Professional Email (5 questions -> 3 selected)
  {
    id: 'C16', section: 'career', topic: 'Professional Email',
    question: 'What is the purpose of the "Subject" line in an email?',
    options: [
      { id: 'a', text: 'To clearly summarize the purpose of the email' },
      { id: 'b', text: 'To write the full email message' },
      { id: 'c', text: 'To write your password' },
      { id: 'd', text: 'To leave it blank' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C17', section: 'career', topic: 'Professional Email',
    question: 'In email, what does "BCC" stand for?',
    options: [
      { id: 'a', text: 'Blind Carbon Copy' },
      { id: 'b', text: 'Basic Contact Connection' },
      { id: 'c', text: 'Business Communication Channel' },
      { id: 'd', text: 'Backup Copy Center' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C18', section: 'career', topic: 'Professional Email',
    question: 'Which email sign-off is most professional for job applications?',
    options: [
      { id: 'a', text: 'Sincerely, / Best regards,' },
      { id: 'b', text: 'Bye bye,' },
      { id: 'c', text: 'Catch ya later,' },
      { id: 'd', text: 'Cya,' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C19', section: 'career', topic: 'Professional Email',
    question: 'Before clicking "Send" on an important work email, you should:',
    options: [
      { id: 'a', text: 'Proofread for errors and verify attachments' },
      { id: 'b', text: 'Forward it to 50 friends' },
      { id: 'c', text: 'Add random colorful fonts' },
      { id: 'd', text: 'Turn off your computer immediately' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C20', section: 'career', topic: 'Professional Email',
    question: 'Writing an entire email in ALL CAPS is perceived as:',
    options: [
      { id: 'a', text: 'Shouting or aggressive tone' },
      { id: 'b', text: 'Polite and gentle' },
      { id: 'c', text: 'Standard business protocol' },
      { id: 'd', text: 'Required for technical topics' },
    ],
    correctAnswer: 'a',
  },

  // Google Meet (4 questions -> 2 selected)
  {
    id: 'C21', section: 'career', topic: 'Google Meet',
    question: 'Why should you join a virtual interview 5 minutes early?',
    options: [
      { id: 'a', text: 'To test audio, video, and show punctuality' },
      { id: 'b', text: 'To rush the interviewer' },
      { id: 'c', text: 'It gives bonus interview marks automatically' },
      { id: 'd', text: 'To record the call secretly' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C22', section: 'career', topic: 'Google Meet',
    question: 'What is the best camera position during a virtual meeting?',
    options: [
      { id: 'a', text: 'At eye level with adequate face lighting' },
      { id: 'b', text: 'Pointing up at the ceiling fan' },
      { id: 'c', text: 'Covered with a piece of paper' },
      { id: 'd', text: 'Pointing directly at your keyboard' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C23', section: 'career', topic: 'Google Meet',
    question: 'Before sharing your screen in a meeting, you should:',
    options: [
      { id: 'a', text: 'Close unrelated private tabs and notifications' },
      { id: 'b', text: 'Open all your personal photo folders' },
      { id: 'c', text: 'Disconnect from the internet' },
      { id: 'd', text: 'Turn your screen brightness to zero' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C24', section: 'career', topic: 'Google Meet',
    question: 'In Google Meet, what does the "Raise Hand" button do?',
    options: [
      { id: 'a', text: 'Signals you have a question without interrupting' },
      { id: 'b', text: 'Mutes the speaker' },
      { id: 'c', text: 'Leaves the meeting' },
      { id: 'd', text: 'Takes a screenshot' },
    ],
    correctAnswer: 'a',
  },

  // Google Calendar (4 questions -> 2 selected)
  {
    id: 'C25', section: 'career', topic: 'Google Calendar',
    question: 'What is the most effective way to schedule a recurring weekly meeting?',
    options: [
      { id: 'a', text: 'Set the recurrence rule to "Weekly"' },
      { id: 'b', text: 'Create 52 separate events by hand' },
      { id: 'c', text: 'Call every participant each week' },
      { id: 'd', text: 'Post a status on WhatsApp' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C26', section: 'career', topic: 'Google Calendar',
    question: 'Why should you include an agenda in a meeting invite?',
    options: [
      { id: 'a', text: 'To let participants know what will be discussed' },
      { id: 'b', text: 'To make the calendar entry look full' },
      { id: 'c', text: 'It is optional and never read' },
      { id: 'd', text: 'To show off your typing skills' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C27', section: 'career', topic: 'Google Calendar',
    question: 'What does marking yourself as "Busy" in Google Calendar show others?',
    options: [
      { id: 'a', text: 'You are unavailable during that time slot' },
      { id: 'b', text: 'You are on vacation for the month' },
      { id: 'c', text: 'Your account has been deleted' },
      { id: 'd', text: 'You have left the company' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C28', section: 'career', topic: 'Google Calendar',
    question: 'What do calendar notifications and reminders help prevent?',
    options: [
      { id: 'a', text: 'Missing important meetings and deadlines' },
      { id: 'b', text: 'Computer hardware failures' },
      { id: 'c', text: 'Software virus infections' },
      { id: 'd', text: 'Internet disconnection' },
    ],
    correctAnswer: 'a',
  },

  // MS Office (4 questions -> 2 selected)
  {
    id: 'C29', section: 'career', topic: 'MS Office',
    question: 'In Microsoft Excel, every formula must begin with which sign?',
    options: [
      { id: 'a', text: '=' },
      { id: 'b', text: '#' },
      { id: 'c', text: '@' },
      { id: 'd', text: '$' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C30', section: 'career', topic: 'MS Office',
    question: 'In PowerPoint, what is the best rule for text on slides?',
    options: [
      { id: 'a', text: 'Keep it concise with key bullet points' },
      { id: 'b', text: 'Paste full paragraphs of 500 words' },
      { id: 'c', text: 'Use 10 different fonts on every slide' },
      { id: 'd', text: 'Make font size 6pt so more words fit' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C31', section: 'career', topic: 'MS Office',
    question: 'In Microsoft Word, what does the shortcut "Ctrl + S" do?',
    options: [
      { id: 'a', text: 'Saves the current document' },
      { id: 'b', text: 'Selects the entire document' },
      { id: 'c', text: 'Sends the document via email' },
      { id: 'd', text: 'Shuts down the computer' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C32', section: 'career', topic: 'MS Office',
    question: 'What is Excel\'s "SUM" function used for?',
    options: [
      { id: 'a', text: 'Adds all numbers in a range of cells' },
      { id: 'b', text: 'Deletes all cells in a column' },
      { id: 'c', text: 'Changes text to uppercase' },
      { id: 'd', text: 'Draws a chart automatically' },
    ],
    correctAnswer: 'a',
  },

  // Personal Branding (4 questions -> 2 selected)
  {
    id: 'C33', section: 'career', topic: 'Personal Branding',
    question: 'What is professional "personal branding"?',
    options: [
      { id: 'a', text: 'How you showcase your skills, values, and reputation' },
      { id: 'b', text: 'Designing a t-shirt with your photo' },
      { id: 'c', text: 'Posting jokes on corporate websites' },
      { id: 'd', text: 'Having the loudest voice in the room' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C34', section: 'career', topic: 'Personal Branding',
    question: 'What is an "Elevator Pitch"?',
    options: [
      { id: 'a', text: 'A brief 30-60 second introduction of your value' },
      { id: 'b', text: 'A speech delivered only inside an elevator' },
      { id: 'c', text: 'A technical sales contract' },
      { id: 'd', text: 'A 2-hour formal seminar' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C35', section: 'career', topic: 'Personal Branding',
    question: 'Which platform is best for software engineers to showcase live code?',
    options: [
      { id: 'a', text: 'GitHub' },
      { id: 'b', text: 'TikTok' },
      { id: 'c', text: 'Snapchat' },
      { id: 'd', text: 'Pinterest' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'C36', section: 'career', topic: 'Personal Branding',
    question: 'Why should your resume, LinkedIn, and GitHub profile be consistent?',
    options: [
      { id: 'a', text: 'It builds credibility and trust with recruiters' },
      { id: 'b', text: 'It is a mandatory government rule' },
      { id: 'c', text: 'It automatically guarantees a job offer' },
      { id: 'd', text: 'It avoids having to write new code' },
    ],
    correctAnswer: 'a',
  },
];

// ─────────────────────────────────────────────────────────────────
// EXAM GENERATION (SERVER-SIDE ONLY)
// Generates exactly 50 randomized questions with shuffled options
// ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateExamForStudent(): Question[] {
  const behavioral = shuffleArray(behavioralQuestions).slice(0, 10);
  const situational = shuffleArray(situationalQuestions).slice(0, 10);
  const technical = shuffleArray(technicalQuestions).slice(0, 10);

  const byTopic = (topic: string, n: number) =>
    shuffleArray(careerQuestions.filter((q) => q.topic === topic)).slice(0, n);

  const career = [
    ...byTopic('LinkedIn', 3),
    ...byTopic('ATS Resume', 3),
    ...byTopic('Interview Preparation', 3),
    ...byTopic('Professional Email', 3),
    ...byTopic('Google Meet', 2),
    ...byTopic('Google Calendar', 2),
    ...byTopic('MS Office', 2),
    ...byTopic('Personal Branding', 2),
  ];

  const shuffleOptions = (q: Question): Question => {
    // Preserve the correct answer pointer after shuffling
    const correctOpt = q.options.find((o) => o.id === q.correctAnswer);
    const shuffled = shuffleArray(q.options);
    const newOptions = shuffled.map((opt, idx) => {
      const newId = ['a', 'b', 'c', 'd'][idx];
      return { id: newId, text: opt.text, originalId: opt.id };
    });
    const newCorrect = newOptions.find((o: any) => o.originalId === q.correctAnswer)?.id || 'a';

    return {
      ...q,
      options: newOptions.map(({ id, text }) => ({ id, text })),
      correctAnswer: newCorrect,
    };
  };

  return [
    ...behavioral.map(shuffleOptions),
    ...situational.map(shuffleOptions),
    ...technical.map(shuffleOptions),
    ...career.map(shuffleOptions),
  ];
}
