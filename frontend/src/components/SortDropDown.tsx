import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropDownProps {
  className?: string;
  disabled?: boolean;
  sortByVotes: () => void;
  votesActive: boolean;
  sortByDatePosted: () => void;
  datePostedActive: boolean;
}

export default function SortDropDown(props: SortDropDownProps) {
  const {
    className,
    disabled,
    sortByVotes,
    votesActive,
    sortByDatePosted,
    datePostedActive,
  } = props;
  return (
    <DropdownButton className={className} disabled={disabled} title="Sort By">
      <Dropdown.Item onClick={sortByVotes} active={votesActive}>
        Votes
      </Dropdown.Item>
      <Dropdown.Item onClick={sortByDatePosted} active={datePostedActive}>
        Date Posted
      </Dropdown.Item>
    </DropdownButton>
  );
}
