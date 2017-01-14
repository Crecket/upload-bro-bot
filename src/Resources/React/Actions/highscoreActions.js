import RequestHandler from '../Helpers/RequestHandler';
import Logger from '../Helpers/Logger';

export function lookupHighscores(champion) {
    return (dispatch) => {
        Logger.info('Doing lookup for champion: ' + champion);

        // start lookup status
        dispatch({type: "SET_HIGHSCORE_LOADING"});

        // send GA event
        gaSearchChampion(champion);

        // not found, do new request
        RequestHandler.request(
            API_URL + "highscores/champion/" + champion + "/0/20",
            (result) => {
                Logger.debug(result);

                // dispatch result
                dispatch({
                    type: "LOOKUP_HIGHSCORE_SUCCESS",
                    payload: {
                        selectedChampion: champion,
                        championData: result.highscores
                    }
                });
            },
            (err) => {
                Logger.error(err);

                // finish lookup status
                dispatch({type: "LOOKUP_HIGHSCORE_FAIL"});

                // open the modal message
                dispatch({
                    type: 'MODAL_OPEN',
                    payload: {
                        message: "Failed to lookup champion highscores.",
                        title: "Something went wrong."
                    }
                });
            }
        );
    }
}

export function selectChampion(champion) {
    return (dispatch) => {
        dispatch({
            type: "SELECT_HIGHSCORE_CHAMPION",
            payload: {
                selectedChampion: champion
            }
        });
    }
}
