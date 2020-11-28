import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropDownProps {
  disabled?: boolean;
  sortByVotes: () => void;
  topActive: boolean;
  sortByNew: () => void;
  newActive: boolean;
}

const SortDropDown = ({
  disabled,
  sortByVotes,
  topActive,
  sortByNew,
  newActive,
}: SortDropDownProps) => {
  return (
    <DropdownButton disabled={disabled} title="Sort By">
      <Dropdown.Item onClick={sortByVotes} active={topActive}>
        Top
      </Dropdown.Item>
      <Dropdown.Item onClick={sortByNew} active={newActive}>
        New
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default SortDropDown;
