module.exports = [
    {
        question: 'What is Stakepool',
        answer:
            'With Stakepool you can earn bonus staking rewards by predicting the future tez price range in USD value. You win if you correctly predict the tez price range at the completion of the 2 cycles that come after the cycle in which you placed your bet. All baking rewards accrued in the smart contract are distributed among the winners as weighted averages of the total staked amount. If your prediction is wrong, your staked tez is returned but you miss out on your staking rewards for the respective cycles.',
    },
    {
        question: 'How does it work',
        answer:
            "Let's give an example: We are currently in cycle 1. Alice and Bob think that they know which price Tezos will be after the coming staking period (2 cycles). They both place a bet on Stakepool. Bob is bullish and Alice is bearish. Alice and Bob wait for 2 cycles. Plenty of time to attract more friends to stakepool and increase potential juicy rewards for future predictions. Cycle 4 starts and the price is up! Bob has won! He can withdraw his staked tez and of course his juicy stakepool bonus. Alice is wrong this time, she can withdraw her staked tez to give it another try. Unfortunately no staking rewards for Alice this time.",
    },
    {
        question: 'How do I get Started',
        answer:
            'Connect your Temple wallet to stakepool and use your gut feeling to stake on a price range that you believe XTZ will be at the end of the designated cycle.',
    },
    {
        question: 'How is Stakepool different from other prediction markets',
        answer:
            'In other prediction markets you lose your bet if your prediction turns out to be wrong, here in Stakepool you get your bet back. If you win then you get rewards just like any other prediction market.',
    },
    {
        question: 'For how long is my stake delegated to a baker',
        answer:
            'Stakes are delegated two cycles after the cycle you placed your bet (so starting at cycle 150 means your stake is delegated until cycle 152). We are calling this the staking period',
    },
    {
        question: 'Is my money safe',
        answer:
            'Absolutely! Only you can withdraw your stake. We suggest you go through our smart contract to better understand our authorization checks.',
    },

    {
        question: 'On which browsers is Stakepool supported',
        answer:
            'You can use any browser that is compatible with Temple wallet, such as Chrome or Firefox.',
    },

    {
        question: 'How much profit can I expect from Stakepool',
        answer:
            'Well, there is no fixed ROI, your rewards are directly proportional to the amount staked on a particular cycle, so if you want to earn more rewards invite your friends on stakepool.',
    },
    {
        question: 'Where can I learn more about Stakepool',
        answer:
            'You can go through our code base on Github, you can also read our documentation on Notion.',
    },
];
