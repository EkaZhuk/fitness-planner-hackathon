import os
import pytest
import asyncio
from typing import List, Dict, Any

# Правильная настройка DeepSeek
DEEPSEEK_API_KEY = "sk-fe5a416971e94a59b8b49adaf0d6be6a"  # Ваш ключ
DEEPSEEK_BASE_URL = "https://api.deepseek.com"  # Только базовый URL, без /v1/chat/completions


class DeepSeekEvaluator:
    """Оценка RAG ответов с помощью DeepSeek API"""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or DEEPSEEK_API_KEY

        try:
            # Импортируем OpenAI библиотеку (она совместима с DeepSeek)
            from openai import AsyncOpenAI

            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=DEEPSEEK_BASE_URL
            )
            self.model = "deepseek-chat"
            print(f"✓ DeepSeek клиент инициализирован с моделью {self.model}")

        except ImportError:
            raise ImportError("Please install openai: pip install openai")
        except Exception as e:
            print(f"✗ Ошибка инициализации DeepSeek: {e}")
            raise

    async def evaluate_faithfulness(self, answer: str, context: List[str]) -> float:
        """Оценка faithfulness через DeepSeek"""

        prompt = f"""Оцени faithfulness ответа по шкале от 0 до 1.

Контекст (информация из базы знаний):
{' '.join(context)}

Ответ RAG системы:
{answer}

Инструкция:
- 1.0 = Ответ полностью соответствует контексту
- 0.7 = Ответ в основном соответствует, есть небольшие неточности
- 0.5 = Ответ частично соответствует, есть противоречия
- 0.3 = Ответ в основном противоречит контексту
- 0.0 = Ответ полностью противоречит контексту

Ответь только числом от 0 до 1 с одним знаком после запятой."""

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=10
            )
            score = float(response.choices[0].message.content.strip())
            return min(max(score, 0.0), 1.0)
        except Exception as e:
            print(f"  ⚠️ Ошибка оценки faithfulness: {e}")
            return 0.5

    async def evaluate_relevancy(self, answer: str, question: str) -> float:
        """Оценка релевантности через DeepSeek"""

        prompt = f"""Оцени релевантность ответа вопросу по шкале от 0 до 1.

Вопрос пользователя:
{question}

Ответ RAG системы:
{answer}

Инструкция:
- 1.0 = Ответ полностью отвечает на вопрос
- 0.7 = Ответ отвечает, но упускает детали
- 0.5 = Ответ частично отвечает
- 0.3 = Ответ слабо связан с вопросом
- 0.0 = Ответ完全不 по теме

Ответь только числом от 0 до 1 с одним знаком после запятой."""

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=10
            )
            score = float(response.choices[0].message.content.strip())
            return min(max(score, 0.0), 1.0)
        except Exception as e:
            print(f"  ⚠️ Ошибка оценки релевантности: {e}")
            return 0.5

    async def comprehensive_evaluation(self,
                                       question: str,
                                       answer: str,
                                       context: List[str]) -> Dict[str, Any]:
        """Комплексная оценка через DeepSeek"""

        faithfulness = await self.evaluate_faithfulness(answer, context)
        relevancy = await self.evaluate_relevancy(answer, question)

        overall = (faithfulness * 0.6 + relevancy * 0.4)

        if overall >= 0.8:
            status = "excellent"
        elif overall >= 0.6:
            status = "good"
        elif overall >= 0.4:
            status = "needs_improvement"
        else:
            status = "poor"

        return {
            "faithfulness": faithfulness,
            "relevancy": relevancy,
            "overall": overall,
            "status": status,
            "model": self.model
        }


# Создаем фикстуру для тестов
@pytest.fixture
async def deepseek_evaluator():
    """Фикстура для DeepSeek evaluator"""
    evaluator = DeepSeekEvaluator()
    yield evaluator
    # Закрываем клиент если нужно
    if hasattr(evaluator, 'client'):
        await evaluator.client.close()


# Тесты
@pytest.mark.asyncio
async def test_deepseek_connection():
    """Тест подключения к DeepSeek API"""
    print("\n=== Тест подключения к DeepSeek API ===")

    try:
        evaluator = DeepSeekEvaluator()

        # Простой тестовый запрос
        test_prompt = "Ответь 'OK' одним словом"
        response = await evaluator.client.chat.completions.create(
            model=evaluator.model,
            messages=[{"role": "user", "content": test_prompt}],
            max_tokens=5
        )

        print(f"✓ Подключение успешно! Ответ: {response.choices[0].message.content}")
        assert response.choices[0].message.content is not None

    except Exception as e:
        print(f"✗ Ошибка подключения: {e}")
        pytest.skip(f"DeepSeek API недоступен: {e}")


@pytest.mark.asyncio
async def test_deepseek_faithfulness():
    """Тест faithfulness через DeepSeek API"""

    print("\n=== DeepSeek Faithfulness Test ===")

    try:
        evaluator = DeepSeekEvaluator()
    except Exception as e:
        pytest.skip(f"DeepSeek не инициализирован: {e}")

    context = [
        "Подросткам до 18 лет не рекомендуется бегать более 30 минут без перерыва",
        "Оптимальная частота тренировок для начинающих - 3 раза в неделю"
    ]

    test_cases = [
        {
            "answer": "Подросток 16 лет может бегать каждый день по часу",
            "description": "Плохой ответ - противоречит контексту",
            "expected_max": 0.5
        },
        {
            "answer": "Подростку 16 лет рекомендуется бегать 3 раза в неделю по 30 минут",
            "description": "Хороший ответ - соответствует контексту",
            "expected_min": 0.7
        }
    ]

    for case in test_cases:
        print(f"\n{case['description']}:")
        print(f"  Answer: {case['answer']}")

        score = await evaluator.evaluate_faithfulness(case["answer"], context)
        print(f"  Faithfulness score: {score:.2f}")

        if "expected_max" in case:
            assert score <= case["expected_max"], f"Score {score} > {case['expected_max']}"
        if "expected_min" in case:
            assert score >= case["expected_min"], f"Score {score} < {case['expected_min']}"


@pytest.mark.asyncio
async def test_deepseek_batch_evaluation():
    """Batch тестирование с DeepSeek"""

    print("\n=== DeepSeek Batch Evaluation ===")

    try:
        evaluator = DeepSeekEvaluator()
    except Exception as e:
        pytest.skip(f"DeepSeek не инициализирован: {e}")

    test_suite = [
        {
            "name": "Кейс 1: Подросток",
            "question": "Можно ли бегать каждый день?",
            "answer": "Рекомендуется 3 раза в неделю по 30 минут",
            "context": [
                "Подросткам до 18 лет рекомендуется бегать 3 раза в неделю",
                "Начинающим нужен щадящий режим"
            ]
        },
        {
            "name": "Кейс 2: Пожилой человек",
            "question": "Стоит ли начинать бегать?",
            "answer": "Проконсультируйтесь с врачом перед началом. Начните с ходьбы 2-3 раза в неделю.",
            "context": [
                "Перед началом бега людям старше 60 лет нужна консультация врача",
                "Рекомендуется начинать с ходьбы"
            ]
        },
        {
            "name": "Кейс 3: Опытный бегун",
            "question": "Как улучшить время на 10к?",
            "answer": "Добавьте интервальные тренировки 800м и темповые забеги на 5к",
            "context": [
                "Интервальные тренировки улучшают скорость",
                "Темповые бег развивает выносливость"
            ]
        }
    ]

    results = []

    for case in test_suite:
        print(f"\n{case['name']}:")
        print(f"  Question: {case['question']}")
        print(f"  Answer: {case['answer']}")

        result = await evaluator.comprehensive_evaluation(
            case["question"],
            case["answer"],
            case["context"]
        )

        results.append(result)

        print(f"  📊 Faithfulness: {result['faithfulness']:.2f}")
        print(f"  📊 Relevancy: {result['relevancy']:.2f}")
        print(f"  📊 Overall: {result['overall']:.2f}")
        print(f"  ✅ Status: {result['status']}")

    # Статистика
    avg_faithfulness = sum(r['faithfulness'] for r in results) / len(results)
    avg_relevancy = sum(r['relevancy'] for r in results) / len(results)
    avg_overall = sum(r['overall'] for r in results) / len(results)

    print(f"\n{'=' * 50}")
    print("📈 DeepSeek Итоговая статистика:")
    print(f"  Средняя Faithfulness: {avg_faithfulness:.2f}")
    print(f"  Средняя Relevancy: {avg_relevancy:.2f}")
    print(f"  Средняя Overall: {avg_overall:.2f}")


@pytest.mark.asyncio
async def test_deepseek_vs_local_comparison():
    """Сравнение DeepSeek с локальными метриками"""

    print("\n=== Сравнение DeepSeek vs Локальные метрики ===")

    # Импортируем локальную метрику
    from test_rag_metrics import SimpleGigaChatClient

    try:
        deepseek = DeepSeekEvaluator()
    except Exception as e:
        pytest.skip(f"DeepSeek не инициализирован: {e}")

    local = SimpleGigaChatClient()

    test_cases = [
        {
            "question": "Как часто бегать новичку?",
            "answer": "Новичкам рекомендуется бегать 3 раза в неделю",
            "context": ["Для начинающих оптимальная частота - 3 раза в неделю"]
        },
        {
            "question": "Можно ли бегать каждый день?",
            "answer": "Бегайте каждый день по часу",
            "context": ["Не рекомендуется бегать каждый день, оптимально 3-4 раза в неделю"]
        }
    ]

    for i, case in enumerate(test_cases, 1):
        print(f"\nКейс {i}: {case['question']}")
        print(f"Ответ: {case['answer']}")

        # Локальная оценка
        local_faithfulness = local.check_faithfulness(case["answer"], case["context"])
        local_relevancy = local.check_relevancy(case["answer"], case["question"])

        # DeepSeek оценка
        deepseek_result = await deepseek.comprehensive_evaluation(
            case["question"],
            case["answer"],
            case["context"]
        )

        print(f"\n  Локальные метрики:")
        print(f"    Faithfulness: {local_faithfulness:.2f}")
        print(f"    Relevancy: {local_relevancy:.2f}")

        print(f"\n  DeepSeek метрики:")
        print(f"    Faithfulness: {deepseek_result['faithfulness']:.2f}")
        print(f"    Relevancy: {deepseek_result['relevancy']:.2f}")
        print(f"    Overall: {deepseek_result['overall']:.2f}")
        print(f"    Статус: {deepseek_result['status']}")


# Запуск тестов
if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])