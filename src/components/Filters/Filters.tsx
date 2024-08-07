import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { filter } from "../../store/action-creator/filter";
import classes from "./Filters.module.scss";
import "./FilterAnt.scss";

import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

const CheckboxGroup = Checkbox.Group;

const Filters: React.FC = () => {
  const filters = ["Без пересадок", "1 пересадка", "2 пересадки", "3 пересадки"];
  const { checkedFilters } = useAppSelector((state) => state.filter);

  const dispatch = useAppDispatch();

  const checkAll = filters.length === checkedFilters.length;

  const indeterminate = checkedFilters.length > 0 && checkedFilters.length < filters.length;

  const onChange = (list: string[]) => {
    dispatch(filter(list));
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    dispatch(filter(e.target.checked ? filters : []));
  };

  return (
    <div className={`${classes.aviasalesAppFilter} ${classes.filter}`}>
      <p className={classes.filterText}>Количество пересадок</p>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Все
      </Checkbox>
      <CheckboxGroup options={filters} value={checkedFilters} onChange={onChange} />
    </div>
  );
};

export default Filters;
