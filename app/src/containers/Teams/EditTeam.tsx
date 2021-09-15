import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import type { Teams } from "@/features/admin/team";

import { useQuery } from '@apollo/react-hooks';
import { RootState } from '@/config/store';
import { addTeamMember } from '@/features/admin/team';
import getTeamDetailQuery from '@/queries/teams/getTeamDetail';
import InviteMember from './InviteMember';
import TeamDetail from './TeamDetail';
import TeamMember from './TeamMember';

type Params = {
  teamId: string;
}

const EditTeam: React.FC = () => {
  const { teamId } = useParams<Params>();
  const { teams } = useSelector((state: RootState) => state.team);
  const [currentTeam, setCurrentTeam] = useState<Teams>();
  const { data, loading } = useQuery(getTeamDetailQuery, {
    variables: { alias: teamId },
  });
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!loading) {
      dispatch(addTeamMember({ teamID: teamId, data: data?.getTeamDetail }));
    }
  }, [data, loading]);

  useEffect(() => {
    const team = teams.find((it) => it.teamID === teamId);
    if (teamId && team) {
      setCurrentTeam(team);
    } else {
      history.replace('/teams');
    }
  }, [teams]);

  return currentTeam ? (
    <>
      <TeamDetail team={currentTeam} />
      <TeamMember
        teamMembers={currentTeam.teamMembers.filter(
          (it) => it.status !== 'pending',
        )}
      />
      <InviteMember
        alias={teamId}
        teamMembers={currentTeam.teamMembers.filter(
          (it) => it.status === 'pending',
        )}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default EditTeam;