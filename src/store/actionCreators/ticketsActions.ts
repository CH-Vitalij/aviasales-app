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

export const fetchTicketsData = () => {
  return async (dispatch: Dispatch<TicketsAction>) => {
    try {
      dispatch(fetchDataRequest());
      const result = await new AviasalesService().getTickets();

      dispatch(fetchDataSuccess(result));
    } catch (err) {
      dispatch(fetchDataERROR("Произошла ошибка при загрузке билетов"));
    }
  };
};
