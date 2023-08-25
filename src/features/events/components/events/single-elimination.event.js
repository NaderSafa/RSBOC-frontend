// import Reacket from 'reacket'
import React from 'react'
import Reacket from '../../../../services/matches/single-elimination/index'

const SingleElimination = () => {
  const matches = [
    {
      _id: '64d3ad54c6673c7b8dfafd4b',
      registration1: {
        _id: '64bebb1c4958f548eea7bba4',
        players: [
          {
            _id: '64be9facd2393050b2bdebf7',
            full_name: 'Mohamed ossama abdallah ',
            club: {
              _id: '64beb41707ff9e2d6be0c0e1',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FZohour.png?alt=media&token=67cc9c65-a83f-4627-8a7d-26410fca2b1c',
            },
          },
          {
            _id: '64bb7e2112622c95722f2e47',
            full_name: 'Nader Safa Metwaly',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
        ],
      },
      registration2: {
        _id: '64d11e13067d954c58405bdf',
        players: [
          {
            _id: '64ca9c35a3b71228c77cabad',
            full_name: 'Yousef Mohamed Saad',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
          {
            _id: '64c162c3301e54fd98a9ff74',
            full_name: 'yassin eslam magdy',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
        ],
      },
      sets: [
        {
          set_number: 1,
          registration1_score: 10,
          registration2_score: 1,
          _id: '64d5245a0dc1cd16a1e4bd7e',
        },
        {
          set_number: 2,
          registration1_score: 10,
          registration2_score: 2,
          _id: '64d5245a0dc1cd16a1e4bd7f',
        },
      ],
      id: 1,
      round: 1,
      match: 1,
    },
    {
      id: 2,
      round: 1,
      match: 2,
      registration1: {
        _id: '64bebb1c4958f548eea7bba4',
        players: [
          {
            _id: '64be9facd2393050b2bdebf7',
            full_name: 'Mohamed ossama abdallah ',
            club: {
              _id: '64beb41707ff9e2d6be0c0e1',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FZohour.png?alt=media&token=67cc9c65-a83f-4627-8a7d-26410fca2b1c',
            },
          },
          {
            _id: '64bb7e2112622c95722f2e47',
            full_name: 'Nader Safa Metwaly',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
        ],
      },
      registration2: {
        _id: '64d11e13067d954c58405bdf',
        players: [
          {
            _id: '64ca9c35a3b71228c77cabad',
            full_name: 'Yousef Mohamed Saad',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
          {
            _id: '64c162c3301e54fd98a9ff74',
            full_name: 'yassin eslam magdy',
            club: {
              _id: '64bd0aaef92d4e4f85d16419',
              image_url:
                'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/clubs%2FRowad.png?alt=media&token=aaeeacbf-b7b8-4965-84ba-b88ade1d861d',
            },
          },
        ],
      },
    },
    {
      id: 3,
      round: 1,
      match: 3,
      players: [
        {
          id: 5,
          name: 'Mr. Brown',
          seed: 3,
        },
        {
          id: 6,
          name: 'Mr. Black',
          seed: 6,
        },
      ],
      score: [0, 1],
    },
    {
      id: 4,
      round: 1,
      match: 4,
      players: [
        {
          id: 7,
          name: 'Mr. Red',
          seed: 7,
        },
        {
          id: 8,
          name: 'Mr. Yellow',
          seed: 2,
        },
      ],
      score: [1, 0],
    },
    {
      id: 5,
      round: 2,
      match: 1,
      players: [
        {
          id: 2,
          name: 'Mr. White',
          seed: 7,
        },
        {
          id: 4,
          name: 'Mr. Blue',
          seed: 4,
        },
      ],
      score: [0, 1],
    },
    {
      id: 6,
      round: 2,
      match: 2,
      players: [
        {
          id: 6,
          name: 'Mr. Black',
          seed: 6,
        },
        {
          id: 7,
          name: 'Mr. Red',
          seed: 7,
        },
      ],
      score: [0, 1],
    },
    {
      id: 7,
      round: 3,
      match: 1,
      players: [
        {
          id: 4,
          name: 'Mr. Blue',
          seed: 4,
        },
        {
          id: 7,
          name: 'Mr. Red',
          seed: 7,
        },
      ],
      score: [0, 1],
    },
  ]

  return <Reacket matches={matches} />
}

export default SingleElimination
