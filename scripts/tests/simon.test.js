/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../simon");

jest.spyOn(window, "alert").mockImplementation(() => { });


beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("simon.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("Game object contains correct keys", () => {
    test("Score key exists", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("choices contains correct IDs", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    });
});

describe("newGame function works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        document.getElementById("score").innerText = "42";
        newGame();
    });
    test("Should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    test("Should clear the playerMoves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("Should be one move in the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test("Should display 0 for element with ID of 'score'", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("Data-listener should be true", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        };
    });
});

describe("Gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.playerMoves = [];
        game.currentGame = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.playerMoves = [];
        game.currentGame = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("Should add the correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);

    });
    test("Should increment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("Should call an alert if the move is wrong", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong move!");
    });
    test("Should toggle turnInProgress to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("Clicking during computer's turn should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});