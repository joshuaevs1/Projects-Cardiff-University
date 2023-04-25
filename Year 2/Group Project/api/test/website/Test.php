<?php

namespace UnitTestFiles\Test;

use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class FirstTest extends TestCase
{
    public function testTrueAssetsToTrue()
    {
        $condition = true;
        $this->assertTrue($condition);
    }
}
