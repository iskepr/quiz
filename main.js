let countspan = document.querySelector(".count span");
let bulets = document.querySelector(".bullets");
let bulletscontainer = document.querySelector(".bullets .spans ");
let quizarea = document.querySelector(".quiz-area");
let answerarea = document.querySelector(".answer-area");
let submitbut = document.querySelector(".submit");
let resultsarea = document.querySelector(".results");
let countdouwnarea = document.querySelector(".countdouwn");
//set options
let curentindex = 0;
let rightanswer = 0;
let countdouwninterval;
//------------------مدة الامتحان
let timeleft = 40;
//-------------------------

function getquestion() {
  let myrequest = new XMLHttpRequest();

  myrequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionobject = JSON.parse(this.responseText);
      let qcount = questionobject.length;

      //creat bullets span +
      creatbullets(qcount);

      //add data quiz
      addquizdata(questionobject[curentindex], qcount);

      countdouwn(timeleft, qcount);

      //click on submmitt
      submitbut.onclick = () => {
        // chec right answer
        let therightanswer = questionobject[curentindex].right_answer;

        //increas index
        curentindex++;

        // check the answer
        checkanswer(therightanswer);

        // remove last quisttion
        quizarea.innerHTML = "";
        answerarea.innerHTML = "";
        addquizdata(questionobject[curentindex], qcount);

        // handel bulets class
        handelbullts();

        clearInterval(countdouwninterval);
        countdouwn(timeleft, qcount);

        showresults(qcount);
        showrebut(qcount);

        let storedRightAnswer = localStorage.getItem("rightanswer");
        if (storedRightAnswer !== null) {
          rightanswer = parseInt(storedRightAnswer);
        }
      };
    }
  };

  myrequest.open("GET", "main.json", true);
  myrequest.send();
}
getquestion();

//creat bullts spans
function creatbullets(num) {
  countspan.innerHTML = num;

  //craet bullet
  for (let i = 0; i < num; i++) {
    //creat span
    let thebullet = document.createElement("span");

    //chic th span quis
    if (i === 0) {
      thebullet.className = "on";
    }
    //add span = count
    bulletscontainer.appendChild(thebullet);
  }
}

function addquizdata(obj, count) {
  if (curentindex < count) {
    // creat h2 titel
    let questiontitle = document.createElement("h2");

    //creat qu text
    let questiontext = document.createTextNode(obj["title"]);

    // add title in h2
    questiontitle.appendChild(questiontext);

    // add h2 in quiz area
    quizarea.appendChild(questiontitle);

    //add answers
    for (let i = 1; i <= 4; i++) {
      // creat main div
      let maindiv = document.createElement("div");

      // add class for main div
      maindiv.className = "answer";

      // create radio button and check box
      let radioinput = document.createElement("input");
      // type radio
      radioinput.type = "radio";
      // name
      radioinput.name = "question";
      radioinput.id = `answer_${i}`;
      radioinput.dataset.answer = obj[`answer_${i}`];

      // create label for radio button
      let radiolabel = document.createElement("label");
      // add for radio
      radiolabel.htmlFor = `answer_${i}`;

      // creat lable text
      let radiotext = document.createTextNode(obj[`answer_${i}`]);

      // add text for lable
      radiolabel.appendChild(radiotext);

      //add input + lable to main div
      maindiv.appendChild(radioinput);
      maindiv.appendChild(radiolabel);

      // add all in answer area
      answerarea.appendChild(maindiv);
    }
  }
}

function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let choseranswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choseranswer = answers[i].dataset.answer;
    }
  }
  if (ranswer === choseranswer) {
    rightanswer++;
  } else {
    console.log("baad");
  }
}

function handelbullts() {
  // get all the bullet spans that are currently visible
  let bulletsspans = bulletscontainer.querySelectorAll(".spans .on");
  let arayofspans = Array.from(bulletsspans);

  // add the "on" class from all the bullet spans
  arayofspans.forEach((span) => {
    span.classList.add("on");
  });
  // add the "on" class to the current bullet span
  if (curentindex < bulletscontainer.children.length) {
    bulletscontainer.children[curentindex].classList.add("on");
  }
}

function showresults(count) {
  let results;
  if (curentindex === count) {
    quizarea.remove();
    answerarea.remove();
    submitbut.remove();
    bulets.remove();

    // حفظ rightanswer في localStorage
    localStorage.setItem("rightanswer", rightanswer);

    if (rightanswer > count / 2 && rightanswer < count) {
      results = `<span class="good">😉شغال</span> :  ${rightanswer} من ${count} `;
    } else if (rightanswer === count) {
      results = `<span class="perfect">😎ايه الجمدان ده الا</span> :  ${rightanswer} من ${count} `;
    } else {
      results = `<span class="bad">😒روح زاكر</span> :  ${rightanswer} من ${count} `;
    }

    // إنشاء زر إعادة الامتحان
    let reexamButton = document.createElement("button");
    reexamButton.textContent = "إعادة الامتحان";
    reexamButton.className = "submit";

    // إضافة زر إعادة الامتحان بعد نتائج الامتحان
    resultsarea.insertAdjacentElement("afterend", reexamButton);

    // ربط الزر بدالة JavaScript لإعادة الامتحان
    reexamButton.onclick = function () {
      // إعادة تهيئة الاختبار أو إعادة تحميل الصفحة
      location.reload();
      // أو يمكنك استدعاء دالة تعيد تهيئة الاختبار من هنا
      // وذلك بناءً على متطلبات تطبيقك
    };
  } else {
    results.remove();
  }
  resultsarea.innerHTML = results;
}

function countdouwn(duration, count) {
  if (curentindex < count) {
    let minutes, seconds;
    countdouwninterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdouwnarea.innerHTML = `${minutes} :  ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdouwninterval);
        submitbut.click();
      }
    }, 1000);
  }
}
