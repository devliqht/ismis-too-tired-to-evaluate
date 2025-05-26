/**
 * Adds evaluation buttons to the faculty information section of the page.
 * Creates four buttons (Bad Prof, Mid Prof, Best Prof, Above-mid Prof) that when clicked
 * will automatically fill out the evaluation form with predefined ratings and comments.
 * 
 * The buttons are inserted next to the faculty name in the sticky header.
 * Each button corresponds to a different rating level (1, 3, or 4) and comment set.
 * 
 * @function addEvaluationButtons
 * @returns {void}
 * @author devliqht
 * @version 1.1
 */
function addEvaluationButtons() {
    // the sticky div is where the faculty information is stored..
    const sticky_div = document.querySelector('.sticky');
    if (!sticky_div) return;

    if (sticky_div.querySelector('.button-container')) return;

    const faculty_span = sticky_div.querySelectorAll('span')[1];
    if (!faculty_span) return;

    const button_container = document.createElement('div');
    button_container.className = 'button-container'; 
    button_container.style.margin = '10px';
    button_container.style.display = 'inline-block'; 

    const bad_button = document.createElement('button');
    bad_button.textContent = 'Bad Prof';
    bad_button.style.marginRight = '10px';
    bad_button.addEventListener('click', () => autofillEvaluation(1));

    const mid_button = document.createElement('button');
    mid_button.textContent = 'Mid Prof';
    mid_button.style.marginRight = '10px';
    mid_button.addEventListener('click', () => autofillEvaluation(3));

    const best_button = document.createElement('button');
    best_button.textContent = 'Best Prof';
    best_button.style.marginRight = '10px';
    best_button.addEventListener('click', () => autofillEvaluation(4));

    const above_mid_button = document.createElement('button');
    above_mid_button.textContent = 'Above-mid Prof';
    above_mid_button.style.marginRight = '10px';
    above_mid_button.addEventListener('click', () => autofillEvaluation(3.5));

    button_container.appendChild(bad_button);
    button_container.appendChild(mid_button);
    button_container.appendChild(above_mid_button);
    button_container.appendChild(best_button);

    faculty_span.parentNode.insertBefore(button_container, faculty_span.nextSibling);

    function autofillEvaluation(likert_score) {
        const category_offsets = {
            0: { second: 1, min: 1, max: 4 }, 1: { second: 2, min: 1, max: 4 }, 2: { second: 3, min: 1, max: 4 }, 3: { second: 4, min: 1, max: 4 }, 4: { second: 5, min: 1, max: 4 }, // Items
            5: { second: 6, min: 5, max: 8 }, 6: { second: 7, min: 5, max: 8 }, 7: { second: 8, min: 5, max: 8 }, 8: { second: 9, min: 5, max: 8 }, 9: { second: 10, min: 5, max: 8 }, // Teaching Quality
            10: { second: 11, min: 5, max: 8 }, 11: { second: 12, min: 5, max: 8 }, 12: { second: 13, min: 5, max: 8 }, 13: { second: 14, min: 5, max: 8 }, 14: { second: 15, min: 5, max: 8 }, 15: { second: 16, min: 5, max: 8 }, 16: { second: 17, min: 5, max: 8 }, // Student Learning Assessments
            17: { second: 18, min: 5, max: 8 }, 18: { second: 19, min: 5, max: 8 }, 19: { second: 20, min: 5, max: 8 }, 20: { second: 21, min: 5, max: 8 }, 21: { second: 22, min: 5, max: 8 }, 22: { second: 23, min: 5, max: 8 }, 23: { second: 24, min: 5, max: 8 }, 24: { second: 25, min: 5, max: 8 }, // Teacher-Learner Support
            25: { second: 26, min: 9, max: 12 }, 26: { second: 27, min: 9, max: 12 }, 27: { second: 28, min: 9, max: 12 }, 28: { second: 29, min: 9, max: 12 }, 29: { second: 30, min: 9, max: 12 } // Student Outcomes
        };

        // fill likert ratings
        for (let i = 0; i <= 29; i++) {
            const name = `response[${i}].Remarks`;
            const radios = document.getElementsByName(name);
            if (radios.length > 0) {
                const { min, max, second } = category_offsets[i] || { min: 1, max: 4, second: 1 };
                let mapped_score;
                if (likert_score === 1) mapped_score = min; 
                else if (likert_score === 3) mapped_score = Math.floor((min + max) / 2); 
                else if (likert_score === 3.5) mapped_score = Math.floor((min + max + 1) / 2); 
                else mapped_score = max; 

                const expected_value = `${mapped_score},${second}`;
                let is_checked = false;
                radios.forEach(radio => {
                    if (radio.value === expected_value && !is_checked) {
                        radio.checked = true;
                        is_checked = true; 
                    }
                });
            }
        }

        const commentNames = ['comments[0].Remarks', 'comments[1].Remarks', 'comments[2].Remarks'];
        const commentTextareas = commentNames.map(name => document.querySelector(`textarea[name="${name}"]`));
        let likeBest, toImprove, overallExperience;

        if (likert_score === 1) { 
            likeBest = 'N/A';
            toImprove = 'The teaching style';
            overallExperience = 'Bad';
            setRecommendation(false); 
        } else if (likert_score === 3) { 
            likeBest = 'N/A';
            toImprove = 'Its okay';
            overallExperience = 'OKAY';
            setRecommendation(true); 
        } else if (likert_score === 4) { 
            likeBest = 'The teacher and the course';
            toImprove = 'N/A';
            overallExperience = 'Very good';
            setRecommendation(true); 
        } else if (likert_score === 3.5) { 
            likeBest = 'N/A';
            toImprove = 'Its okay';
            overallExperience = 'OKAY';
            setRecommendation(true); 
        }

        if (commentTextareas[0]) commentTextareas[0].value = likeBest || '';
        if (commentTextareas[1]) commentTextareas[1].value = toImprove || '';
        if (commentTextareas[2]) commentTextareas[2].value = overallExperience || '';

        // SATISFACTION RATING
        const satisfaction_name = 'response[30].Remarks';
        const satisfaction_radios = document.getElementsByName(satisfaction_name);
        if (satisfaction_radios.length > 0) {
            let satisfaction_score = likert_score === 1 ? 1 : likert_score === 3 || likert_score === 3.5 ? 5 : 10; 
            satisfaction_radios.forEach(radio => {
                if (radio.value.startsWith((satisfaction_score + 12).toString() + ',')) { 
                    radio.checked = true;
                }
            });
        }
    }

    function setRecommendation(checked) {
        const recommendationRadios = document.getElementsByName('comments[3].Score');
        if (recommendationRadios.length > 0) {
            recommendationRadios.forEach(radio => {
                if (checked && radio.value === '1') { 
                    radio.checked = true;
                } else if (!checked && radio.value === '2') { 
                    radio.checked = true;
                }
            });
        }
    }
}

// use MutationObserver when there is new modal appearing, re-run the script
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            const sticky_div = document.querySelector('.sticky');
            if (sticky_div) {
                addEvaluationButtons();
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

setTimeout(() => {
    addEvaluationButtons();
}, 1000);