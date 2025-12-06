const textBox = document.getElementById('textBox');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const statusText = document.getElementById('status');
const savedList = document.getElementById('savedList');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => {
        statusText.textContent = "● Receiving Audio...";
        statusText.style.color = "#00e676"; 
                
        startBtn.classList.add('pulsing');
        startBtn.textContent = "Listening...";
                
        startBtn.disabled = true;
        stopBtn.disabled = false;
        textBox.focus();
    };
        recognition.onend = () => {
            statusText.textContent = "System Idle";
            statusText.style.color = "#a0a0a0"; 
                
            startBtn.classList.remove('pulsing');
            startBtn.textContent = "Start Listening";

            startBtn.disabled = false;
            stopBtn.disabled = true;
        };
        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        textBox.value += transcript + ' ';
                    }
                }
            };
        } else {
            alert("Your browser does not support Speech Recognition.");
        }
        startBtn.addEventListener('click', () => { if(recognition) recognition.start(); });
        stopBtn.addEventListener('click', () => { if(recognition) recognition.stop(); });
        let savedNotes = JSON.parse(localStorage.getItem('voiceNotes')) || [];
        renderNotes();

        saveBtn.addEventListener('click', () => {
            const text = textBox.value.trim();
            if (text) {
                savedNotes.push(text);
                localStorage.setItem('voiceNotes', JSON.stringify(savedNotes));
                renderNotes();
                textBox.value = '';
                const originalText = saveBtn.textContent;
                saveBtn.textContent = "Saved";
                setTimeout(() => saveBtn.textContent = originalText, 1000);
            }
        });

        function renderNotes() {
            savedList.innerHTML = '';
            savedNotes.forEach((note, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${note}</span>
                    <button class="delete-btn" onclick="deleteNote(${index})">&times;</button>
                `;
                savedList.appendChild(li);
            });
        }

        window.deleteNote = (index) => {
            savedNotes.splice(index, 1);
            localStorage.setItem('voiceNotes', JSON.stringify(savedNotes));
            renderNotes();
        }