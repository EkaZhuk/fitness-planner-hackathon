import pytest
from deepeval import assert_test
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase
from your_module import get_ai_response  # ваш импорт
import asyncio
from unittest.mock import Mock

# Мок пользователя для тестов
class MockUser:
    def __init__(self):
        self.username = "test_user"
        self.email = "test@example.com"
        self.full_name = "Тест Тестович"
        self.gender = "male"
        self.age = 30
        self.weight_kg = 75
        self.height_cm = 175
        self.level = "intermediate"

# Фикстуры для тестов
@pytest.fixture
def mock_user():
    return MockUser()

@pytest.fixture
def metrics():
    return {
        "faithfulness": FaithfulnessMetric(threshold=0.7),
        "answer_relevancy": AnswerRelevancyMetric(threshold=0.7)
    }

# Тест 1: Проверка на галлюцинации (Faithfulness)
@pytest.mark.asyncio
async def test_faithfulness_age_contradiction(mock_user, metrics):
    """Проверяет, не противоречит ли ответ возрасту пользователя"""

    # Вопрос, где ИИ может ошибиться
    user_question = "Могу ли я бежать марафон?"

    # Получаем реальный ответ от вашей системы
    response = await get_ai_response(user_question, mock_user)

    # Ожидаемый контекст (то, что ИИ ДОЛЖЕН учитывать)
    retrieval_context = [
        f"Пользователь: {mock_user.age} лет, пол: {mock_user.gender}, "
        f"уровень: {mock_user.level}"
    ]

    test_case = LLMTestCase(
        input=user_question,
        actual_output=response,
        retrieval_context=retrieval_context,
        expected_output="Учитывая ваш возраст и уровень, можно, но с осторожностью"  # опционально
    )

    # Проверяем метрику
    metrics["faithfulness"].measure(test_case)
    assert_test(test_case, [metrics["faithfulness"]])

# Тест 2: Проверка релевантности ответа
@pytest.mark.asyncio
async def test_answer_relevancy_for_offtopic(mock_user, metrics):
    """Проверяет, корректно ли ИИ отказывается от офтоп-вопросов"""

    user_question = "Как приготовить борщ?"
    response = await get_ai_response(user_question, mock_user)

    test_case = LLMTestCase(
        input=user_question,
        actual_output=response,
        retrieval_context=["Вы AI-тренер по бегу, не отвечаете на кулинарные вопросы"]
    )

    metrics["answer_relevancy"].measure(test_case)
    # Низкая релевантность = хороший отказ
    assert metrics["answer_relevancy"].score < 0.3

# Тест 3: Пакетная проверка с разными пользователями
@pytest.mark.asyncio
async def test_batch_faithfulness():
    """Проверяет faithfulness на наборе кейсов"""

    test_cases = [
        {
            "user": MockUser(age=16, level="beginner"),  # юный
            "question": "Можно ли мне бегать каждый день?",
            "expected_hint": "возраст, щадящий режим"
        },
        {
            "user": MockUser(age=65, weight_kg=90, level="beginner"),  # пожилой с весом
            "question": "Стоит ли начинать бегать?",
            "expected_hint": "консультация врача, ходьба"
        },
        {
            "user": MockUser(age=25, level="advanced"),
            "question": "Как улучшить время на 10к?",
            "expected_hint": "интервальные, темповые"
        }
    ]

    faithfulness_metric = FaithfulnessMetric(threshold=0.7)

    for case in test_cases:
        response = await get_ai_response(case["question"], case["user"])

        # Формируем контекст из профиля
        context = [
            f"Возраст: {case['user'].age}, "
            f"Вес: {case['user'].weight_kg}, "
            f"Уровень: {case['user'].level}"
        ]

        test_case = LLMTestCase(
            input=case["question"],
            actual_output=response,
            retrieval_context=context
        )

        faithfulness_metric.measure(test_case)
        print(f"User {case['user'].age} лет, {case['user'].level}: "
              f"Faithfulness = {faithfulness_metric.score}")
        print(f"Ответ: {response[:100]}...")
        print("-" * 50)

# Тест 4: Ручная проверка без ассертов (для отладки)
async def manual_check():
    """Ручная проверка с выводом метрик"""

    user = MockUser(age=70, weight_kg=95, level="beginner")
    question = "Можно ли мне бегать?"

    response = await get_ai_response(question, user)

    faithfulness = FaithfulnessMetric()
    test_case = LLMTestCase(
        input=question,
        actual_output=response,
        retrieval_context=[
            "Пользователь: 70 лет, вес 95 кг, начинающий. "
            "При ожирении и пожилом возрасте нужна консультация врача"
        ]
    )

    faithfulness.measure(test_case)

    print(f"Вопрос: {question}")
    print(f"Ответ: {response}")
    print(f"Faithfulness score: {faithfulness.score}")
    print(f"Причина: {faithfulness.reason}")

# Запуск ручной проверки
if __name__ == "__main__":
    asyncio.run(manual_check())
