import * as wasm from "wasm-cetkaik";

wasm.my_init_function();

const { depict_state, depict_state2 } = (() => {
    function depict_state2(state) {
        const PLAYER_STATE = {
            ia_side: {
                player_name_short: "筆",
                player_name: "筆墨風"
            },
            a_side: {
                player_name_short: "星",
                player_name: "星享青",
            }
        };
        const {
            f: {
                board, a_side_hop1zuo1, ia_side_hop1zuo1
            },
            whose_turn, season, scores: { ia: ia_score, a: a_score }, rate, tam_has_moved_previously
        } = state;

        if (whose_turn === "ASide") {
            document.getElementsByClassName("location_a_side")[0].classList.add("turn_active");
        }

        switch (season) {
            case "Iei2": { document.getElementById("season_text").innerHTML = "春"; break; }
            case "Xo1": { document.getElementById("season_text").innerHTML = "夏"; break; }
            case "Kat2": { document.getElementById("season_text").innerHTML = "秋"; break; }
            case "Iat1": { document.getElementById("season_text").innerHTML = "冬"; break; }
        }

        document.getElementById("turn_text").innerHTML = 0; // fixme
        document.getElementById("rate_text").innerHTML = rate.slice(1); // strip off the X
        document.getElementById("ia_side_player_name_short_text").innerHTML = PLAYER_STATE.ia_side.player_name_short;
        document.getElementById("a_side_player_name_short_text").innerHTML = PLAYER_STATE.a_side.player_name_short;
        document.getElementById("a_side_player_name_text").innerHTML = PLAYER_STATE.a_side.player_name;
        document.getElementById("ia_side_player_name_text").innerHTML = PLAYER_STATE.ia_side.player_name;
        document.getElementById("a_side_piece_stand").innerHTML = depict_hop1zuo1(a_side_hop1zuo1);
        document.getElementById("ia_side_piece_stand").innerHTML = depict_hop1zuo1(ia_side_hop1zuo1);
        document.getElementById("score_a_side_text").innerHTML = a_score;
        document.getElementById("score_ia_side_text").innerHTML = ia_score;
        const focus = "ZIA"; // FIXME
        let ans = "";
        for (let key in board) {
            if (board[key] === "Tam2") {
                ans += fooo(key, "皇", null, focus == key)
            } else {
                ans += fooo(key, `${board[key].NonTam2Piece.color}${board[key].NonTam2Piece.prof}`, board[key].NonTam2Piece.side === "ASide")
            }
            
        }

        document.getElementById("pieces_inner").innerHTML = ans;
    }

    function depict_board(board, focus) {
        let ans = "";
        for (let key in board) {
            ans += fooo(key, ...board[key], focus == key)
        }

        document.getElementById("pieces_inner").innerHTML = ans;
    }

    const profs = [
        "船", "無", "兵", "弓", "車", "虎", "馬", "筆", "巫", "将", "王", "皇"
    ];

    function depict_hop1zuo1(pieces) {
        let ans = "";
        for (let i = 0; i < pieces.length; i++) {
            const [color, prof] = pieces[i];
            ans += `<li><div style="width: 23px; height: 43px; transform: scale(0.26); transform-origin: top left">${barr(color, prof, false)}</div></li>`;
        }
        return ans
    }

    function depict_state(STATE) {
        document.getElementById("season_text").innerHTML = STATE.season;
        document.getElementById("turn_text").innerHTML = STATE.turn;
        document.getElementById("rate_text").innerHTML = STATE.rate;
        document.getElementById("ia_side_player_name_short_text").innerHTML = STATE.ia_side.player_name_short;
        document.getElementById("a_side_player_name_short_text").innerHTML = STATE.a_side.player_name_short;
        document.getElementById("a_side_player_name_text").innerHTML = STATE.a_side.player_name;
        document.getElementById("ia_side_player_name_text").innerHTML = STATE.ia_side.player_name;
        document.getElementById("a_side_piece_stand").innerHTML = depict_hop1zuo1(STATE.a_side.hop1zuo1);
        document.getElementById("ia_side_piece_stand").innerHTML = depict_hop1zuo1(STATE.ia_side.hop1zuo1);
        depict_board(STATE.board, STATE.focus);
    }

    function barr(color, prof, is_bold) {
        const x = profs.indexOf(prof) * -100 - 27;
        const y = is_bold ? 0 : -277;
        const color_path = {
            "黒": "ゴシック駒",
            "赤": "ゴシック駒_赤",
        }[color];
        return `<div
    style="width: 87px; height: 87px; background-position-x: ${x}px; background-position-y: ${y}px; background-image: url(${color_path}.svg); ">
</div>`
    }

    function fooo(coord, color_and_prof, rotated, is_bold) {
        const column = {
            K: 0,
            L: 1,
            N: 2,
            T: 3,
            Z: 4,
            X: 5,
            C: 6,
            M: 7,
            P: 8
        }[coord[0]];
        const row = {
            IA: 8,
            AU: 7,
            AI: 6, Y: 5, O: 4, U: 3, I: 2, E: 1, A: 0
        }[coord.slice(1)];
        const left = left_margin + 43 * (column - 0.5);
        const top = top_margin + 43 * (row - 0.5);
        if (color_and_prof === "皇") {
            return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${"rotate(90deg)"}">
            ${barr("黒", "皇", is_bold)}
        </div>`;
        } else {
            const [color, prof] = color_and_prof;
            return `
        <div style="position: absolute; left: ${left}px; top: ${top}px; transform: scale(0.26) ${rotated ? "rotate(180deg)" : ""}">
            ${barr(color, prof, is_bold)}
        </div>`;
        }

    }

    return { depict_state, depict_state2 };
})();
/*
depict_state({
    season: "秋",
    turn: 29,
    rate: 4,
    focus: "PO",
    board: {
        PO: ["黒兵", false],
        MO: ["赤兵", false],
        CY: ["黒兵", false],
        ZY: ["黒将", false],
        NY: ["黒兵", false],
        CAI: ["黒車", false],
        ZAI: ["黒船", false],
        TAI: ["赤兵", false],
        NAI: ["赤将", false],
        LAI: ["赤兵", false],
        KAI: ["黒兵", false],
        KAU: ["黒巫", false],
        LAU: ["黒弓", false],
        NAU: ["赤車", false],
        TAU: ["黒虎", false],
        XAU: ["赤兵", true],
        MAU: ["赤弓", false],
        PAU: ["赤巫", false],
        PIA: ["黒筆", false],
        MIA: ["黒馬", false],
        ZIA: ["黒王", false],
        LIA: ["赤馬", false],
        KIA: ["赤筆", false],
        ZO: ["皇", null],
        PU: ["黒兵", true],
        CU: ["黒兵", true],
        ZU: ["赤船", true],
        TI: ["赤兵", true],
        NI: ["黒兵", true],
        LU: ["赤兵", true],
        KU: ["黒兵", true],
        XI: ["黒将", true],
        CI: ["赤車", true],
        MI: ["赤兵", true],
        PI: ["黒弓", true],
        PE: ["黒巫", true],
        PA: ["赤筆", true],
        MA: ["赤馬", true],
        CE: ["赤将", true],
        XE: ["黒虎", true],
        TE: ["黒車", true],
        TA: ["赤王", true],
        KA: ["黒筆", true],
        KE: ["赤巫", true],
        LE: ["赤弓", true],
        ZA: ["赤虎", true],
    },
    ia_side: {
        player_name_short: "筆",
        hop1zuo1: ["黒馬"],
        player_name: "筆墨風"
    },
    a_side: {
        player_name_short: "星",
        player_name: "星享青",
        hop1zuo1: ["赤兵", "赤虎"]
    },

});*/

depict_state2(wasm.send_example_to_js());