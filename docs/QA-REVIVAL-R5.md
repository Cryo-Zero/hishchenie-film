# REVIVAL R5 QA

## Profile instant sync
1. Open comments under any review and create your own reply.
2. Change alias and avatar in the profile.
3. Owner review and visible cached owner reply should update immediately, without waiting for the 10-second poll.
4. A second tab should update shortly via BroadcastChannel/background sync.

## Stable refresh
1. Open `index.html#about` and refresh several times. No visible smooth travel from the top should occur.
2. Open any other hash section and repeat.
3. On `reviews.html`, scroll to the profile/feed workspace. URL should become `#reviewWorkspace`. Refresh: workspace should remain the landing section.
4. Scroll to the reviews summary. URL should become `#reviewsTop`. Refresh: summary should remain the landing section.

## Header rating
1. Hard-refresh with DevTools network throttling.
2. The score may change from `—` to the actual value, but EN + rating controls should not move horizontally.

## Score labels
- 0: Критически
- 1: Ужасно
- 2: Очень слабо
- 3: Слабо
- 4: Ниже среднего
- 5: Средне
- 6: Неплохо
- 7: Хорошо
- 8: Очень хорошо
- 9: Отлично
- 10: Выдающееся
