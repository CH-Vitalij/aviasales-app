import { Dispatch } from "redux";
import { TicketsAction, TicketsActionType } from "../../types/ticketsDataTypes";
import { TicketsData } from "../../types/aviasalesDataTypes";

import AviasalesService from "../../service/aviasales-service";

const fetchDataRequest = (): TicketsAction => ({
  type: TicketsActionType.FETCH_TICKETS_REQUEST,
});

const fetchDataSuccess = (data: TicketsData): TicketsAction => ({
  type: TicketsActionType.FETCH_TICKETS_SUCCESS,
  payload: data,
});

const fetchDataERROR = (error: string): TicketsAction => ({
  type: TicketsActionType.FETCH_TICKETS_ERROR,
  payload: error,
});

const fetchSearchId = async (obj: AviasalesService) => {
  console.log(obj);
  return await obj.getSearchId();
};

const successiveRequests = async (result, fullRes, obj, searchId, dispatch) => {
  console.log("successiveRequests");

  while (!result.stop) {
    console.log("true");

    try {
      result = await obj.getTickets(searchId);
      fullRes.tickets.push(...result.tickets);
    } catch (err) {
      console.log(err);
      if (err.message === "500") {
        console.log("Ошибка 500");
        continue;
      } else {
        throw err;
      }
    }

    console.log(fullRes);
  }

  dispatch(fetchDataSuccess(fullRes));
};

export const fetchTicketsData = () => {
  const obj = new AviasalesService();

  let executed = false;
  let searchId = "";
  let fullRes = { tickets: [], stop: false };
  let result = null;

  return async function handleData(dispatch: Dispatch<TicketsAction>) {
    try {
      dispatch(fetchDataRequest());

      if (!executed) {
        searchId = await fetchSearchId(obj);
        executed = true;
      }

      try {
        result = await obj.getTickets(searchId);
        fullRes.tickets.push(...result.tickets);
      } catch (err) {
        console.log(err);
        if (err.message === "500") {
          console.log("Ошибка 500");
          successiveRequests(result, fullRes, obj, searchId, dispatch);
          return;
        } else {
          throw err;
        }
      }

      console.log(result);

      successiveRequests(result, fullRes, obj, searchId, dispatch);

      dispatch(fetchDataSuccess(result));
    } catch (err) {
      console.log(err);
      dispatch(fetchDataERROR("Произошла ошибка при загрузке билетов"));
    }
  };
};
