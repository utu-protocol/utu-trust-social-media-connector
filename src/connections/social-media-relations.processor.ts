import { Queue } from 'bull';

export const processTelegramRelationships = async (
  id,
  address: any,
  clientId,
  relationships,
  saveRelationshipQueue,
) => {
  const relations = relationships.users.map((contact) => {
    // return contact;
    return {
      type: 'social',
      sourceCriteria: {
        type: 'Address',
        ids: {
          uuid: address,
          address: address,
          telegram: id,
        },
      },
      targetCriteria: {
        type: 'Address',
        ids: {
          telegram: contact.id,
        },
      },
      bidirectional: false,
      properties: {
        kind: 'telegram',
      },
    };
  });
  await sendRequests(relations, clientId, saveRelationshipQueue);
};

export const processTwitterRelationships = async (
  id,
  address,
  clientId,
  relationships,
  saveRelationshipQueue,
) => {
  const relations = relationships.data.map((follower) => {
    // return follower;
    return {
      type: 'social',
      sourceCriteria: {
        type: 'Address',
        ids: {
          twitter: follower.id,
        },
      },
      targetCriteria: {
        type: 'Address',
        ids: {
          uuid: address,
          address: address,
          twitter: id,
        },
      },
      bidirectional: false,
      properties: {
        kind: 'twitter',
      },
    };
  });
  await sendRequests(relations, clientId, saveRelationshipQueue);
};

export const sendRequests = async (
  relations: any[],
  clientId: string,
  saveRelationshipQueue: Queue,
) => {
  await Promise.all(
    relations.map(async (relation) => {
      await saveRelationshipQueue.add({
        relation,
        clientId,
      });
      return relation;
    }),
  );
};
